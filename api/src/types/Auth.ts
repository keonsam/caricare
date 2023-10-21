export enum CredentialStatus {
  UNCONFIRMED = 'unconfirmed',
  CONFIRMED = 'confirmed',
}

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}

export type Credential = {
  id: string;
  username: string;
  password: string;
  status: CredentialStatus;
  role: UserRole;
};

export type Login = Pick<Credential, 'username' | 'password'>;

export type Register = Omit<Credential, 'id' | 'status'>;

// confirmation
export type Confirmation = {
  id: string;
  credentialId: string;
  code: number;
};

export type UserDate = {
  credentialId: string;
  role: UserRole;
  status: CredentialStatus;
};
