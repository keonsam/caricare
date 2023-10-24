import { UserRole } from './Register';

export type User = {
  credentialId: string;
  exp: number;
  role: UserRole;
};

export type DoctorForm = {
  firstName: string;
  lastName: string;
  title: string;
  speciality: string;
  officeName: string;
  officeLocation: string;
};

export type PatientForm = {
  firstName: string;
  lastName: string;
  dob: string;
};

export type UserInfoForm = DoctorForm & PatientForm;
