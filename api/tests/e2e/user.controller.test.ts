import { describe, it, expect, beforeEach } from '@jest/globals';
import app from '../../src/app';
import sequelize from '../../src/db/sequelize';
import request from 'supertest';
import { DOCTOR_DATA, PATIENT_DATA } from '../helpers/constants';
import { confirmDoctor, confirmPatient } from '../helpers/credential.helper';

describe.skip('UserController (e2e)', () => {
  //   const USER_ENDPOINT = '/users';
  const DOCTOR_ENDPOINT = '/doctors';
  const PATIENT_ENDPOINT = '/patients';
  let patientToken = '';
  let doctorToken = '';

  beforeEach(async () => {
    await sequelize.truncate({ cascade: true });
    ({ token: patientToken } = await confirmPatient());
    ({ token: doctorToken } = await confirmDoctor());
  });

  describe('Create', () => {
    it('create user info account for patient', async () => {
      const res = await request(app)
        .post(PATIENT_ENDPOINT)
        .send(PATIENT_DATA)
        .set({ Authorization: `Bearer ${patientToken}` })
        .expect('Content-Type', /json/);

      expect(res).toBeTruthy();
      expect(res.statusCode).toBe(201);
      expect(res.body.token).toEqual(expect.any(String));
    });

    it('create user info account for doctor', async () => {
      const res = await request(app)
        .post(DOCTOR_ENDPOINT)
        .send(DOCTOR_DATA)
        .set({ Authorization: `Bearer ${doctorToken}` })
        .expect('Content-Type', /json/);

      expect(res).toBeTruthy();
      expect(res.statusCode).toBe(201);
      expect(res.body.token).toEqual(expect.any(String));
    });
  });
});
