import { ConfirmationRepository } from '../repositories/confirmation.repository';
import { CredentialRepository } from '../repositories/credential.repository';
import { Register, Confirmation, CredentialStatus, Login } from '../types/Auth';
import argon2 from 'argon2';
import { EmailService } from './email.service';
import {
  BadRequestError,
  ConflictError,
  UnAuthorizedError,
} from '../types/ApplicationError';
import { JWTService } from './jwt.service';
import UserRepository from '../repositories/user.repository';

export class AuthService {
  credentialRepository: CredentialRepository;
  confirmRepository: ConfirmationRepository;
  emailService: EmailService;
  jwtService: JWTService;
  userRepo: UserRepository;

  constructor() {
    this.credentialRepository = new CredentialRepository();
    this.confirmRepository = new ConfirmationRepository();
    this.emailService = new EmailService();
    this.jwtService = new JWTService();
    this.userRepo = new UserRepository();
  }

  async login(ip: string, auth: Login) {
    const { username, password } = auth;

    // verify username
    const credential = await this.credentialRepository.findByUsername(username);

    if (!credential) {
      throw new UnAuthorizedError(`Username does not exist`);
    }

    // verify password
    const valid = await argon2.verify(credential.password, password);

    if (!valid) {
      throw new UnAuthorizedError('Invalid password');
    }

    // TODO: verify if confirmation code is valid. Generate a new one if not

    // find user info
    const info = await this.userRepo.findUserByCredentialId(
      credential.role,
      credential.id,
    );

    // generate jwt
    const token = this.jwtService.generateToken({
      credentialId: credential.id,
      role: credential.role,
      status: credential.status,
      info: info || {},
      ipAddress: ip,
    });

    return { token };
  }

  async register(auth: Register) {
    // verify username is not taken
    const { username } = auth;
    const savedCredential =
      await this.credentialRepository.findByUsername(username);

    if (savedCredential?.id) {
      throw new ConflictError('User already exist with that username.');
    }

    // create credential
    const { id: credentialId } = await this.credentialRepository.create({
      ...auth,
      password: await argon2.hash(auth.password),
      status: CredentialStatus.UNCONFIRMED,
    });

    // create confirmation
    const confirm = await this.confirmRepository.create({
      credentialId,
    });

    // send confirmation email
    await this.emailService.sendConfirmationEmail(confirm, username);

    return { confirmationId: confirm.id };
  }

  async confirm(ip: string, confirm: Omit<Confirmation, 'credentialId'>) {
    // validate confirmation id and code
    const savedConfirm = await this.confirmRepository.findByPk(confirm.id);

    if (!savedConfirm) {
      throw new UnAuthorizedError(
        `Confirmation not found for id: ${confirm.id}`,
      );
    }

    if (savedConfirm?.code !== confirm.code) {
      throw new BadRequestError(`Confirmation code not valid: ${confirm.code}`);
    }

    // update credential status to confirmed
    const credential = await this.credentialRepository.findByPk(
      savedConfirm.credentialId,
    );

    if (!credential) {
      throw new BadRequestError(
        `No valid account found for provided confirmation id : ${confirm.id}`,
      );
    }

    credential.status = CredentialStatus.CONFIRMED;
    credential.ipAddress = ip;

    await this.credentialRepository.update(credential);

    // generate jwt
    const token = this.jwtService.generateToken({
      credentialId: credential.id,
      role: credential.role,
      status: credential.status,
      info: {},
      ipAddress: ip,
    });

    return { token };
  }

  async delete(credentialId: string) {
    return this.credentialRepository.delete(credentialId);
    //TODO: Send confirmation of account delete email
  }
}
