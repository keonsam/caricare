import { UserRole } from '../../src/types/Auth';
import { v4 as uuidv4 } from 'uuid';

export const TEST_ID = uuidv4();

export const IP_ADDRESS = 'testIPAddress';
// register
export const REGISTER_PATIENT = {
  username: 'testing@test.com',
  password: 'testing1234@_',
  role: UserRole.PATIENT,
};

export const REGISTER_DOCTOR = {
  username: 'testing1@test.com',
  password: 'testing1234@_',
  role: UserRole.DOCTOR,
};

// user
export const PATIENT_DATA = {
  firstName: 'Test',
  lastName: 'API',
  dob: '2023-10-24T19:23:04.292Z',
  address: 'New York',
  height: 5.9,
  weight: 150.6,
};

export const DOCTOR_DATA = {
  firstName: 'Test Doc',
  lastName: 'API',
  title: 'Dr',
  speciality: 'General',
  officeName: 'Dr Test Doc Office',
  officeLocation: 'California',
};

export const APPOINTMENT_DATA = {
  doctorId: '',
  description: 'test des',
  dateOfAppointment: '2023-10-26T00:00:30.064Z',
};
