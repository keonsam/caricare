export type Doctor = {
  id: string;
  credentialId: string;
  firstName: string;
  lastName: string;
  title: string;
  speciality: string;
  officeName: string;
  officeLocation: string;
  ipAddress: string;
};

export type Patient = {
  id: string;
  credentialId: string;
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  height: number;
  weight: number;
  ipAddress: string;
};

export type PatientData = Omit<Patient, 'id' | 'credentialId'> & {
  credentialId?: string;
};

export type DoctorData = Omit<Doctor, 'id' | 'credentialId'> & {
  credentialId?: string;
};

export type UserInfo = Patient | Doctor;

export type UserInfoData = PatientData | DoctorData;
