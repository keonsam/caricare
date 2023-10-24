import config from '../config';
import jwt from 'jsonwebtoken';
import { UserData } from '../types/Auth';

export class JWTService {
  decodeJWT(token: string) {
    return jwt.verify(token, config.jwtSecret);
  }

  generateToken(userData: UserData) {
    return jwt.sign(userData, config.jwtSecret, { expiresIn: '48h' });
  }
}
