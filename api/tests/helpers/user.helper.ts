import { JWTService } from '../../src/services/jwt.service';
import UserService from '../../src/services/user.service';
import { JWTPayload, Register } from '../../src/types/Auth';
import {
  DOCTOR_DATA,
  IP_ADDRESS,
  PATIENT_DATA,
  REGISTER_DOCTOR,
  REGISTER_PATIENT,
} from './constants';
import { confirmDoctor, confirmPatient } from './credential.helper';

const jwtService = new JWTService();
const userService = new UserService();

export async function createPatient(data?: Register) {
  const { token } = await confirmPatient(data);
  const user = jwtService.decodeJWT(token) as JWTPayload;
  const { token: token2 } = await userService.create(user, {
    ...PATIENT_DATA,
    ipAddress: IP_ADDRESS,
  });
  const user2 = jwtService.decodeJWT(token2) as JWTPayload;
  return { token: token2, userId: user2.info.id || '' };
}

export async function createDoctor(data?: Register) {
  const { token } = await confirmDoctor(data);
  const user = jwtService.decodeJWT(token) as JWTPayload;
  const { token: token2 } = await userService.create(user, {
    ...DOCTOR_DATA,
    ipAddress: IP_ADDRESS,
  });
  const user2 = jwtService.decodeJWT(token2) as JWTPayload;
  return { token: token2, userId: user2.info.id || '' };
}

export async function createPatient2() {
  return createPatient({
    ...REGISTER_PATIENT,
    username: 'testing3@test.com',
    ipAddress: IP_ADDRESS,
  });
}

export async function createDoctor2() {
  return createDoctor({
    ...REGISTER_DOCTOR,
    username: 'testing4@test.com',
    ipAddress: IP_ADDRESS,
  });
}
