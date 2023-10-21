/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from '@jest/globals';
import { CredentialStatus, UserRole } from '../../../src/types/Auth';
import { AuthService } from '../../../src/services/auth.service';
import { CredentialRepository } from '../../../src/repositories/credential.repository';
import { ConfirmationRepository } from '../../../src/repositories/confirmation.repository';
import { EmailService } from '../../../src/services/email.service';
import {
  BadRequestError,
  ConflictError,
  UnAuthorizedError,
} from '../../../src/types/ApplicationError';
import argon2 from 'argon2';

describe('AuthService (unit)', () => {
  const authService = new AuthService();

  // register
  describe('Register', () => {
    let findByUsernameMock: jest.SpyInstance;
    let createCredentialMock: jest.SpyInstance;
    let createConfirmationMock: jest.SpyInstance;
    let sendConfirmationEmail: jest.SpyInstance;

    beforeEach(() => {
      findByUsernameMock = jest
        .spyOn(CredentialRepository.prototype, 'findByUsername')
        .mockResolvedValue(null);
      createCredentialMock = jest
        .spyOn(CredentialRepository.prototype, 'create')
        .mockResolvedValue({ id: 'credentialId' } as any);
      createConfirmationMock = jest
        .spyOn(ConfirmationRepository.prototype, 'create')
        .mockResolvedValue({ id: 'confirmationId' } as any);
      sendConfirmationEmail = jest
        .spyOn(EmailService.prototype, 'sendConfirmationEmail')
        .mockResolvedValue(true);
    });

    it('create credential successfully with valid username and password', async () => {
      const reg = {
        username: 'testing@gmail.com',
        password: 'testing123@_',
        role: UserRole.PATIENT,
      };

      const res = await authService.register(reg);

      expect(findByUsernameMock).toHaveBeenCalledTimes(1);
      expect(findByUsernameMock).toHaveBeenCalledWith(reg.username);

      expect(createCredentialMock).toHaveBeenCalledTimes(1);
      expect(createCredentialMock).toHaveBeenCalledWith({
        ...reg,
        password: expect.not.stringMatching(reg.password),
        status: CredentialStatus.UNCONFIRMED,
      });

      expect(createConfirmationMock).toHaveBeenCalledTimes(1);
      expect(createConfirmationMock).toHaveBeenCalledWith({
        credentialId: 'credentialId',
      });

      expect(sendConfirmationEmail).toHaveBeenCalledTimes(1);

      expect(res.confirmationId).toEqual('confirmationId');
    });

    it('reject if username exist', async () => {
      findByUsernameMock = jest
        .spyOn(CredentialRepository.prototype, 'findByUsername')
        .mockResolvedValue({ id: 'credentialId' } as any);
      const reg = {
        username: 'testing@gmail.com',
        password: 'testing123@_',
        role: UserRole.PATIENT,
      };

      expect(authService.register(reg)).rejects.toBeInstanceOf(ConflictError);

      expect(findByUsernameMock).toHaveBeenCalledTimes(1);
      expect(findByUsernameMock).toHaveBeenCalledWith(reg.username);
    });
  });

  describe('Confirmation', () => {
    let findByPkConfirmation: jest.SpyInstance;
    let findByPkCredential: jest.SpyInstance;
    let updateCredential: jest.SpyInstance;

    const confirmation = {
      id: 'confirmationId',
      credentialId: 'credentialId',
      code: 123456,
    };

    const credential = {
      credentialId: 'credentialId',
      role: UserRole.PATIENT,
      status: CredentialStatus.UNCONFIRMED,
    };

    beforeEach(() => {
      findByPkConfirmation = jest
        .spyOn(ConfirmationRepository.prototype, 'findByPk')
        .mockResolvedValue(confirmation as any);
      findByPkCredential = jest
        .spyOn(CredentialRepository.prototype, 'findByPk')
        .mockResolvedValue(credential as any);
      updateCredential = jest
        .spyOn(CredentialRepository.prototype, 'update')
        .mockResolvedValue([1]);
    });
    it('validate valid confirmation code', async () => {
      const res = await authService.confirm({
        id: confirmation.id,
        code: confirmation.code,
      });

      expect(res).toEqual({ token: expect.any(String) });
      expect(findByPkConfirmation).toHaveBeenCalledTimes(1);
      expect(findByPkCredential).toHaveBeenCalledTimes(1);
      expect(updateCredential).toHaveBeenCalledTimes(1);
    });

    it('failed on invalid confirmation id', async () => {
      findByPkConfirmation = jest
        .spyOn(ConfirmationRepository.prototype, 'findByPk')
        .mockResolvedValue(null);
      expect(
        authService.confirm({
          id: 'invalid',
          code: confirmation.code,
        }),
      ).rejects.toBeInstanceOf(UnAuthorizedError);
    });

    it('failed on invalid confirmation code', async () => {
      expect(
        authService.confirm({
          id: 'invalid',
          code: 654321,
        }),
      ).rejects.toBeInstanceOf(BadRequestError);
    });
  });

  describe('Login', () => {
    let findByUsernameMock: jest.SpyInstance;

    const credential = {
      id: 'credentialId',
      username: 'testing@gmail.com',
      password: 'testing123@_',
      role: UserRole.PATIENT,
      status: CredentialStatus.CONFIRMED,
    };

    beforeEach(async () => {
      findByUsernameMock = jest
        .spyOn(CredentialRepository.prototype, 'findByUsername')
        .mockResolvedValue(credential as any);
    });

    it('successfully login with valid credentials', async () => {
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      const res = await authService.login({
        username: credential.username,
        password: credential.password,
      });

      expect(findByUsernameMock).toBeCalledTimes(1);
      expect(res).toEqual({ token: expect.any(String) });
    });

    it('failed on invalid username', async () => {
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);
      expect(
        authService.login({
          username: credential.username,
          password: credential.password,
        }),
      ).rejects.toBeInstanceOf(UnAuthorizedError);

      expect(findByUsernameMock).toBeCalledTimes(1);
    });

    it('failed on invalid password', async () => {
      findByUsernameMock = jest
        .spyOn(CredentialRepository.prototype, 'findByUsername')
        .mockResolvedValue(null);
      expect(
        authService.login({
          username: credential.username,
          password: credential.password,
        }),
      ).rejects.toBeInstanceOf(UnAuthorizedError);

      expect(findByUsernameMock).toBeCalledTimes(1);
    });
  });
});
