import { Repository } from 'sequelize-typescript';
import Appointment from '../db/models/Appointment';
import sequelize from '../db/sequelize';
import { Appointment as IAppointment } from '../types/Appointment';
import { JWTPayload, UserRole } from '../types/Auth';
import { Pagination } from '../types/Pagination';
import { Op } from 'sequelize';

export default class AppointmentRepository {
  appointmentRepo: Repository<Appointment>;
  constructor() {
    this.appointmentRepo = sequelize.getRepository(Appointment);
  }

  async findAll(user: JWTPayload, pagination: Pagination) {
    const { pageSize, pageNumber, sort, date } = pagination;
    let whereQ: Record<string, unknown> = {};
    const { role, info } = user;

    if (date) {
      whereQ = {
        dateOfAppointment: {
          [Op.gte]: date,
        },
      };
    }
    if (role === UserRole.DOCTOR) {
      whereQ = {
        ...whereQ,
        doctorId: info?.id,
      };
    } else {
      whereQ = {
        // credentialId can be used have instead of patientId
        ...whereQ,
        patientId: info?.id,
      };
    }
    const { count: total, rows: data } =
      await this.appointmentRepo.findAndCountAll({
        where: whereQ,
        include: ['patient', 'doctor'],
        limit: pageSize,
        offset: pageNumber * pageSize,
        order: [['createdAt', sort]],
      });

    return {
      total,
      data,
    };
  }

  async findOne(user: JWTPayload, id: string) {
    const { role, info } = user;
    let whereQ: Record<string, unknown> = { id };
    if (role === UserRole.DOCTOR) {
      whereQ = {
        ...whereQ,
        doctorId: info?.id,
      };
    } else {
      whereQ = {
        // credentialId can be used have instead of patientId
        ...whereQ,
        patientId: info?.id,
      };
    }
    return this.appointmentRepo.findOne({
      where: whereQ,
      include: ['patient', 'doctor'],
    });
  }

  async create(appointment: IAppointment) {
    return this.appointmentRepo.create(appointment);
  }

  async update(id: string, appointment: IAppointment) {
    return this.appointmentRepo.update(appointment, {
      where: {
        id,
      },
    });
  }

  async delete(id: string) {
    return this.appointmentRepo.destroy({
      where: {
        id,
      },
    });
  }
}
