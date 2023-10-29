import { UserRole } from './Register';

export type Doctor = {
  id: string;
  credentialId: string;
  firstName: string;
  lastName: string;
  title: string;
  speciality: string;
  officeName: string;
  officeLocation: string;
};

export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  height: number;
  weight: number;
};

export type UserInfo = {
  id: string;
  firstName: string;
  lastName: string;
};

export type User = {
  credentialId: string;
  exp: number;
  role: UserRole;
  info: Partial<UserInfo>;
};

export type DoctorForm = Omit<Doctor, 'id' | 'credentialId'>;

export type PatientForm = Omit<Patient, 'id'>;

export type UserInfoForm = DoctorForm & PatientForm;
