import UserDoctor from '../db/models/UserDoctor';
import UserPatient from '../db/models/UserPatient';
import { UserInfo, UserDoctor as IUserDoctor } from '../types/User';
import sequelize from '../db/sequelize';
import { Repository } from 'sequelize-typescript';

export default class UserRepository {
  userDoctorRepo: Repository<UserDoctor>;
  userPatientRepo: Repository<UserPatient>;
  constructor() {
    this.userDoctorRepo = sequelize.getRepository(UserDoctor);
    this.userPatientRepo = sequelize.getRepository(UserPatient);
  }

  create(userInfo: UserInfo) {
    if (this.isUserDoctor(userInfo)) {
      return this.userDoctorRepo.create(userInfo);
    } else {
      return this.userPatientRepo.create(userInfo);
    }
  }

  private isUserDoctor(userInfo: UserInfo): userInfo is IUserDoctor {
    return (userInfo as IUserDoctor).title !== undefined;
  }
}
