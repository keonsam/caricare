/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';
import sequelize from '../../src/db/sequelize';
import { ConfirmationRepository } from '../../src/repositories/confirmation.repository';
import {
  TEST_ID,
  REGISTER_DOCTOR,
  REGISTER_PATIENT,
} from '../helpers/constants';
import { registerDoctor, registerPatient } from '../helpers/credential.helper';

describe.skip('AuthController (e2e)', () => {
  const REGISTER_ENDPOINT = '/register';
  const CONFIRM_CODE_ENDPOINT = '/confirm-code';
  const LOGIN_ENDPOINT = '/login';

  // register
  beforeEach(async () => {
    await sequelize.truncate({ cascade: true });
  });

  describe('/register', () => {
    it('register a patient user', async () => {
      const res = await request(app)
        .post(REGISTER_ENDPOINT)
        .send(REGISTER_PATIENT)
        .expect('Content-Type', /json/);

      expect(res).toBeTruthy();
      expect(res.statusCode).toBe(201);
      expect(res.body.confirmationId).toEqual(expect.any(String));
    });

    it('register a doctor user', async () => {
      const res = await request(app)
        .post(REGISTER_ENDPOINT)
        .send(REGISTER_DOCTOR)
        .expect('Content-Type', /json/);

      expect(res).toBeTruthy();
      expect(res.statusCode).toBe(201);
      expect(res.body.confirmationId).toEqual(expect.any(String));
    });

    it('failed if username already exist', async () => {
      await request(app)
        .post(REGISTER_ENDPOINT)
        .send(REGISTER_PATIENT)
        .expect('Content-Type', /json/);

      const res = await request(app)
        .post(REGISTER_ENDPOINT)
        .send(REGISTER_PATIENT)
        .expect('Content-Type', /json/);

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toEqual(
        'User already exist with that username.',
      );
    });
  });

  describe('/confirm-code', () => {
    let confirmationId = '';

    beforeEach(async () => {
      ({ confirmationId } = await registerPatient());
    });

    it('successfully confirm code', async () => {
      const confirmRepository = new ConfirmationRepository();
      const savedConfirm = await confirmRepository.findByPk(confirmationId);
      const code = savedConfirm?.dataValues?.code || 0;

      const res = await request(app)
        .post(CONFIRM_CODE_ENDPOINT)
        .send({
          id: confirmationId,
          code,
        })
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(200);
      expect(res.body.token).toEqual(expect.any(String));
    });

    // throws db error
    it('reject on invalid confirmation Id', async () => {
      const res = await request(app)
        .post(CONFIRM_CODE_ENDPOINT)
        .send({
          id: TEST_ID,
          code: 123456,
        })
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual(
        expect.stringContaining('Confirmation not found for id:'),
      );
    });

    it('rejects on invalid confirm code', async () => {
      const res = await request(app)
        .post(CONFIRM_CODE_ENDPOINT)
        .send({
          id: confirmationId,
          code: 123456,
        })
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual(
        expect.stringContaining('Confirmation code not valid'),
      );
    });
  });

  describe.skip('/login', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role, ...auth } = REGISTER_PATIENT;

    beforeEach(async () => {
      await registerPatient();
      await registerDoctor();
    });
    it('login patient', async () => {
      const res = await request(app)
        .post(LOGIN_ENDPOINT)
        .send(auth)
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(200);
      expect(res.body.token).toEqual(expect.any(String));
    });

    it('rejects invalid username', async () => {
      const res = await request(app)
        .post(LOGIN_ENDPOINT)
        .send({
          username: 'badUsername@gmail.com',
          password: auth.password,
        })
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual(
        expect.stringContaining('Username does not exist'),
      );
    });

    it('rejects invalid password', async () => {
      const res = await request(app)
        .post(LOGIN_ENDPOINT)
        .send({
          username: auth.username,
          password: 'invalidPassword123@',
        })
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual(
        expect.stringContaining('Invalid password'),
      );
    });
  });
});
