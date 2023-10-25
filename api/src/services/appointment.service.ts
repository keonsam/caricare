import AppointmentRepository from '../repositories/appointment.repository';
import { Appointment } from '../types/Appointment';
import { JWTPayload } from '../types/Auth';
import { Pagination } from '../types/Pagination';

export default class AppointmentService {
  appointmentRepository: AppointmentRepository;
  constructor() {
    this.appointmentRepository = new AppointmentRepository();
  }

  findAll(user: JWTPayload, pagination: Pagination) {
    return this.appointmentRepository.findAll(user, pagination);
  }

  findOne(user: JWTPayload, id: string) {
    return this.appointmentRepository.findOne(user, id);
  }

  create(appointment: Appointment) {
    return this.appointmentRepository.create(appointment);
  }

  update(id: string, appointment: Appointment) {
    return this.appointmentRepository.update(id, appointment);
  }
}
