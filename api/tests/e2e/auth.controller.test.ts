/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';
import { UserRole } from '../../src/types/Auth';
import sequelize from '../../src/db/sequelize';
import { ConfirmationRepository } from '../../src/repositories/confirmation.repository';

describe('AuthController (e2e)', () => {
  const REGISTER_ENDPOINT = '/register';
  const CONFIRM_CODE_ENDPOINT = '/confirm-code';
  const LOGIN_ENDPOINT = '/login';
  const reg = {
    username: 'testing@gmail.com',
    password: 'testing123@_',
    role: UserRole.PATIENT,
  };

  // register
  beforeEach(async () => {
    await sequelize.truncate();
  });

  describe('/register', () => {
    it('successfully register user', async () => {
      const res = await request(app)
        .post(REGISTER_ENDPOINT)
        .send(reg)
        .expect('Content-Type', /json/);

      expect(res).toBeTruthy();
      expect(res.statusCode).toBe(201);
      expect(res.body.confirmationId).toEqual(expect.any(String));
    });

    it('failed if username already exist', async () => {
      await request(app)
        .post(REGISTER_ENDPOINT)
        .send(reg)
        .expect('Content-Type', /json/);

      const res = await request(app)
        .post(REGISTER_ENDPOINT)
        .send(reg)
        .expect('Content-Type', /json/);

      expect(res).toBeTruthy();
      expect(res.statusCode).toBe(409);
      expect(res.body.message).toEqual(
        'User already exist with that username.',
      );
    });
  });

  describe('/confirm-code', () => {
    it('successfully confirm code', async () => {
      const { body: confirm } = await request(app)
        .post(REGISTER_ENDPOINT)
        .send(reg)
        .expect('Content-Type', /json/);
      const { confirmationId } = confirm;
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
    it('reject on invalid confirm id', async () => {
      const res = await request(app)
        .post(CONFIRM_CODE_ENDPOINT)
        .send({
          id: 'confirmationId',
          code: 123456,
        })
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(422);
      // expect(res.body).toBeInstanceOf(UnAuthorizedError);
      // expect(res.body.message).toEqual(
      //   expect.stringContaining('Confirmation not found for id:'),
      // );
    });

    it('rejects on invalid confirm code', async () => {
      const { body: confirm } = await request(app)
        .post(REGISTER_ENDPOINT)
        .send(reg)
        .expect('Content-Type', /json/);
      const { confirmationId } = confirm;

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

  describe('/login', () => {
    it('successfully login user', async () => {
      await request(app)
        .post(REGISTER_ENDPOINT)
        .send(reg)
        .expect('Content-Type', /json/);

      const res = await request(app)
        .post(LOGIN_ENDPOINT)
        .send({
          username: reg.username,
          password: reg.password,
        })
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(200);
      expect(res.body.token).toEqual(expect.any(String));
    });

    it('rejects invalid username', async () => {
      await request(app)
        .post(REGISTER_ENDPOINT)
        .send(reg)
        .expect('Content-Type', /json/);

      const res = await request(app)
        .post(LOGIN_ENDPOINT)
        .send({
          username: 'testinginvalid@gmail.com',
          password: reg.password,
        })
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual(
        expect.stringContaining('Username does not exist'),
      );
    });

    it('rejects invalid password', async () => {
      await request(app)
        .post(REGISTER_ENDPOINT)
        .send(reg)
        .expect('Content-Type', /json/);

      const res = await request(app)
        .post(LOGIN_ENDPOINT)
        .send({
          username: reg.username,
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
