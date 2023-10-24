export type UserDoctor = {
  firstName: string;
  lastName: string;
  title: string;
  speciality: string;
  officeName: string;
  officeLocation: string;
};

export type UserPatient = {
  firstName: string;
  lastName: string;
  dob: string;
};

export type UserInfo = UserDoctor | UserPatient;
