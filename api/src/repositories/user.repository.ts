import Doctor from '../db/models/Doctor';
import Patient from '../db/models/Patient';
import { UserInfoData } from '../types/User';
import sequelize from '../db/sequelize';
import { Repository } from 'sequelize-typescript';
import { UserRole } from '../types/Auth';

export default class UserRepository {
  doctorRepo: Repository<Doctor>;
  patientRepo: Repository<Patient>;
  constructor() {
    this.doctorRepo = sequelize.getRepository(Doctor);
    this.patientRepo = sequelize.getRepository(Patient);
  }

  findAllDoctor() {
    return this.doctorRepo.findAll();
  }

  findByPk(id: string) {
    return this.doctorRepo.findByPk(id);
  }

  findProfile(id: string, role: string) {
    if (role === UserRole.PATIENT) {
      return this.patientRepo.findOne({
        where: {
          id,
        },
      });
    } else {
      return this.doctorRepo.findOne({
        where: {
          id,
        },
      });
    }
  }

  findUserByCredentialId(role: UserRole, credentialId: string) {
    if (role === UserRole.PATIENT) {
      return this.patientRepo.findOne({
        where: {
          credentialId,
        },
      });
    } else {
      return this.doctorRepo.findOne({
        where: {
          credentialId,
        },
      });
    }
  }

  create(userInfo: UserInfoData, role: UserRole) {
    if (role === UserRole.PATIENT) {
      return this.patientRepo.create(userInfo);
    } else {
      return this.doctorRepo.create(userInfo);
    }
  }
}
