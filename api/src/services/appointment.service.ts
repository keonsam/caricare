import AppointmentRepository from '../repositories/appointment.repository';
import { CredentialRepository } from '../repositories/credential.repository';
import UserRepository from '../repositories/user.repository';
import {
  ApplicationError,
  ForbiddenError,
  NotFoundError,
} from '../types/ApplicationError';
import { Appointment, AppointmentStatus } from '../types/Appointment';
import { JWTPayload } from '../types/Auth';
import { Pagination } from '../types/Pagination';
import { EmailService } from './email.service';
import UserService from './user.service';

export default class AppointmentService {
  appointmentRepository: AppointmentRepository;
  emailService: EmailService;
  userRepo: UserRepository;
  credentialRepo: CredentialRepository;

  constructor() {
    this.appointmentRepository = new AppointmentRepository();
    this.emailService = new EmailService();
    this.userRepo = new UserRepository();
    this.credentialRepo = new CredentialRepository();
  }

  findAll(user: JWTPayload, pagination: Pagination) {
    return this.appointmentRepository.findAll(user, pagination);
  }

  async findOne(user: JWTPayload, id: string) {
    const appointment = await this.appointmentRepository.findOne(user, id);
    if (!appointment || !appointment?.id) {
      throw new NotFoundError('User has no appointment for given id');
    }
    return appointment;
  }

  async create(user: JWTPayload, appointment: Appointment) {
    // saved appointment details
    appointment.status = AppointmentStatus.PENDING;
    const saved = await this.appointmentRepository.create(appointment);

    // send notification to receiving doctor
    const doctor = await this.userRepo.findByPk(saved.doctorId);
    if (!doctor) throw new ApplicationError('No doctor found for pk');
    const credential = await this.credentialRepo.findByPk(doctor.credentialId);
    if (!credential) throw new ApplicationError('No doctor found for pk');
    const patientName = `${user.info.firstName} ${user.info.lastName}`;
    await this.emailService.sendNewAppointmentNotification(
      credential.username,
      patientName,
      saved.dateOfAppointment,
    );
    return saved;
  }

  update(id: string, appointment: Appointment) {
    return this.appointmentRepository.update(id, appointment);
  }

  async delete(user: JWTPayload, id: string) {
    const appointment = await this.findOne(user, id);
    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new ForbiddenError(
        "Only allowed to delete appointments that are 'pending'",
      );
    }

    // above validates user has permission to delete this
    return this.appointmentRepository.delete(id);
  }
}
