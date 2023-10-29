import { ConfirmationRepository } from '../../src/repositories/confirmation.repository';
import { AuthService } from '../../src/services/auth.service';
import { Register } from '../../src/types/Auth';
import { IP_ADDRESS, REGISTER_DOCTOR, REGISTER_PATIENT } from './constants';

const authService = new AuthService();
const confirmRepo = new ConfirmationRepository();

export async function registerPatient(data = REGISTER_PATIENT) {
  return authService.register({ ...data, ipAddress: IP_ADDRESS });
}

export async function registerDoctor(data = REGISTER_DOCTOR) {
  return authService.register({ ...data, ipAddress: IP_ADDRESS });
}

async function confirmation(confirmationId: string) {
  const confirm = await confirmRepo.findByPk(confirmationId);
  return authService.confirm(IP_ADDRESS, {
    id: confirmationId,
    code: confirm?.dataValues.code,
  });
}

export async function confirmPatient(data?: Register) {
  const { confirmationId } = await registerPatient(data);
  return confirmation(confirmationId);
}

export async function confirmDoctor(data?: Register) {
  const { confirmationId } = await registerDoctor(data);
  return confirmation(confirmationId);
}
