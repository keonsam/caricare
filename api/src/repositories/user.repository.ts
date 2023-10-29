import Doctor from '../db/models/Doctor';
import Patient from '../db/models/Patient';
import { DoctorData as IUserDoctorData, UserInfoData } from '../types/User';
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

  findUserByCredentialId(role: UserRole, credentialId: string) {
    if (role === UserRole.DOCTOR) {
      return this.doctorRepo.findOne({
        where: {
          credentialId,
        },
      });
    } else {
      return this.patientRepo.findOne({
        where: {
          credentialId,
        },
      });
    }
  }

  create(userInfo: UserInfoData) {
    if (this.isUserDoctor(userInfo)) {
      return this.doctorRepo.create(userInfo);
    } else {
      return this.patientRepo.create(userInfo);
    }
  }

  // delete(role: UserRole, id: string) {
  //   if (role === UserRole.DOCTOR) {
  //     return this.doctorRepo.destroy({
  //       where: {
  //         id,
  //       },
  //     });
  //   } else {
  //     return this.patientRepo.destroy({
  //       where: {
  //         id,
  //       },
  //     });
  //   }
  // }

  private isUserDoctor(userInfo: UserInfoData): userInfo is IUserDoctorData {
    return (userInfo as IUserDoctorData).title !== undefined;
  }
}
