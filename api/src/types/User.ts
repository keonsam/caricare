export type UserDoctor = {
  id: string;
  credentialId: string;
  firstName: string;
  lastName: string;
  title: string;
  speciality: string;
  officeName: string;
  officeLocation: string;
};

export type UserPatient = {
  id: string;
  credentialId: string;
  firstName: string;
  lastName: string;
  dob: string;
};

export type UserInfo = UserDoctor | UserPatient;
