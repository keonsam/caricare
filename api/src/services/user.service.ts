import { JWTPayload } from '../types/Auth';
import UserRepository from '../repositories/user.repository';
import { JWTService } from './jwt.service';
import { UserInfo } from '../types/User';

export default class UserService {
  userRepo: UserRepository;
  jwtRepo: JWTService;
  constructor() {
    this.userRepo = new UserRepository();
    this.jwtRepo = new JWTService();
  }

  async create(user: JWTPayload, userInfo: UserInfo) {
    // create user info account
    userInfo.credentialId = user.credentialId;
    const savedUser = await this.userRepo.create(userInfo);

    // regenerate token
    const token = this.jwtRepo.generateToken({
      credentialId: user.credentialId,
      role: user.role,
      status: user.status,
      info: savedUser,
    });

    return { token };
  }
}
