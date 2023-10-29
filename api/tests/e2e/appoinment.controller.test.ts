import { describe, it, expect, beforeEach } from '@jest/globals';
import app from '../../src/app';
import sequelize from '../../src/db/sequelize';
import request from 'supertest';
import { APPOINTMENT_DATA } from '../helpers/constants';
import {
  createDoctor,
  createDoctor2,
  createPatient,
  createPatient2,
} from '../helpers/user.helper';

describe('AppointmentController (e2e)', () => {
  const APPOINTMENT_ENDPOINT = '/appointments';
  let patientToken = '';
  let doctorToken = '';
  let patientId = '';
  let doctorId = '';

  beforeEach(async () => {
    await sequelize.truncate({ cascade: true });
    ({ token: patientToken, userId: patientId } = await createPatient());
    ({ token: doctorToken, userId: doctorId } = await createDoctor());
  });

  describe.skip('find All', () => {
    let patientToken2 = '';
    let doctorId2 = '';
    beforeEach(async () => {
      ({ token: patientToken2 } = await createPatient2());
      ({ userId: doctorId2 } = await createDoctor2());
      // setup //TODO: move to helper
      await request(app)
        .post(APPOINTMENT_ENDPOINT)
        .send({
          ...APPOINTMENT_DATA,
          doctorId,
        })
        .set({ Authorization: `Bearer ${patientToken}` })
        .expect('Content-Type', /json/);

      await request(app)
        .post(APPOINTMENT_ENDPOINT)
        .send({
          ...APPOINTMENT_DATA,
          doctorId: doctorId2,
        })
        .set({ Authorization: `Bearer ${patientToken2}` })
        .expect('Content-Type', /json/);
    });

    it('get appointments for patient', async () => {
      const res = await request(app)
        .get(APPOINTMENT_ENDPOINT)
        .set({ Authorization: `Bearer ${patientToken}` })
        .expect('Content-Type', /json/);

      expect(res).toBeTruthy();
      expect(res.statusCode).toBe(200);
      const { total, data } = res.body;
      expect(total).toEqual(1);
      expect(data.length).toEqual(1);
      expect(data[0].doctorId).toEqual(doctorId);
      expect(data[0].patientId).toEqual(patientId);
    });

    it('get appointments for doctor', async () => {
      const res = await request(app)
        .get(APPOINTMENT_ENDPOINT)
        .set({ Authorization: `Bearer ${doctorToken}` })
        .expect('Content-Type', /json/);

      expect(res).toBeTruthy();
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toEqual(1);
      expect(res.body[0].doctorId).toEqual(doctorId);
      expect(res.body[0].patientId).toEqual(patientId);
    });
  });

  describe.skip('find by Id', () => {
    let patientToken2 = '';
    let doctorToken2 = '';
    let id = '';

    beforeEach(async () => {
      ({ token: patientToken2 } = await createPatient2());
      ({ token: doctorToken2 } = await createDoctor2());
      // setup //TODO: move to helper
      const { body: appoint } = await request(app)
        .post(APPOINTMENT_ENDPOINT)
        .send({
          ...APPOINTMENT_DATA,
          doctorId,
        })
        .set({ Authorization: `Bearer ${patientToken}` })
        .expect('Content-Type', /json/);

      ({ id } = appoint);
    });
    it('get appointment by patient', async () => {
      const res = await request(app)
        .get(`${APPOINTMENT_ENDPOINT}/${id}`)
        .set({ Authorization: `Bearer ${patientToken}` })
        .expect('Content-Type', /json/);

      expect(res).toBeTruthy();
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toEqual(id);
      expect(res.body.doctorId).toEqual(doctorId);
      expect(res.body.patientId).toEqual(patientId);
    });

    it('get appointment for doctor', async () => {
      const res = await request(app)
        .get(`${APPOINTMENT_ENDPOINT}/${id}`)
        .set({ Authorization: `Bearer ${doctorToken}` })
        .expect('Content-Type', /json/);

      expect(res).toBeTruthy();
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toEqual(id);
      expect(res.body.doctorId).toEqual(doctorId);
      expect(res.body.patientId).toEqual(patientId);
    });

    // failing requests
    it('reject get appointment request by different logged in patient', async () => {
      const res = await request(app)
        .get(`${APPOINTMENT_ENDPOINT}/${id}`)
        .set({ Authorization: `Bearer ${patientToken2}` })
        .expect('Content-Type', /json/);

      expect(res).toBeTruthy();
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toEqual(
        expect.stringContaining('User has no appointment for given id'),
      );
    });

    it('reject get appointment request by different assisted doctor', async () => {
      const res = await request(app)
        .get(`${APPOINTMENT_ENDPOINT}/${id}`)
        .set({ Authorization: `Bearer ${doctorToken2}` })
        .expect('Content-Type', /json/);

      expect(res).toBeTruthy();
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toEqual(
        expect.stringContaining('User has no appointment for given id'),
      );
    });
  });

  describe.skip('Create', () => {
    it('create appointment info account for patient', async () => {
      const res = await request(app)
        .post(APPOINTMENT_ENDPOINT)
        .send({
          ...APPOINTMENT_DATA,
          doctorId,
        })
        .set({ Authorization: `Bearer ${patientToken}` })
        .expect('Content-Type', /json/);

      expect(res).toBeTruthy();
      expect(res.statusCode).toBe(201);
      expect(res.body.id).toEqual(expect.any(String));
      expect(res.body.description).toEqual(APPOINTMENT_DATA.description);
    });

    it('reject create appointment request from doctor role', async () => {
      const res = await request(app)
        .post(APPOINTMENT_ENDPOINT)
        .send({
          ...APPOINTMENT_DATA,
          doctorId,
        })
        .set({ Authorization: `Bearer ${doctorToken}` })
        .expect('Content-Type', /json/);

      expect(res).toBeTruthy();
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toEqual('Unauthorized: invalid user role');
    });
  });
});
