import { JWTPayload } from '../types/Auth';
import UserRepository from '../repositories/user.repository';
import { JWTService } from './jwt.service';
import { UserInfoData } from '../types/User';

export default class UserService {
  userRepo: UserRepository;
  jwtRepo: JWTService;
  constructor() {
    this.userRepo = new UserRepository();
    this.jwtRepo = new JWTService();
  }

  async findAllDoctor() {
    return this.userRepo.findAllDoctor();
  }

  async findProfile(id: string, role: string) {
    return this.userRepo.findProfile(id, role);
  }

  async create(user: JWTPayload, userInfo: UserInfoData) {
    // create user info account
    userInfo.credentialId = user.credentialId;
    const savedUser = await this.userRepo.create(userInfo, user.role);

    // regenerate token
    const token = this.jwtRepo.generateToken({
      credentialId: user.credentialId,
      role: user.role,
      status: user.status,
      info: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
      },
      ipAddress: user.ipAddress,
    });

    return { token };
  }
}
