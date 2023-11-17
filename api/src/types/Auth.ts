import { JwtPayload } from 'jsonwebtoken';
import { UserInfo } from './User';

export enum CredentialStatus {
  UNCONFIRMED = 'unconfirmed',
  CONFIRMED = 'confirmed',
}

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
}

export type Credential = {
  id: string;
  username: string;
  password: string;
  status: CredentialStatus;
  role: UserRole;
  ipAddress: string;
};

export type Login = Pick<Credential, 'username' | 'password'>;

export type Register = Omit<Credential, 'id' | 'status'>;

// confirmation
export type Confirmation = {
  id: string;
  credentialId: string;
  code: number;
};

export type UserData = {
  credentialId: string;
  role: UserRole;
  status: CredentialStatus;
  info: Partial<UserInfo>;
  ipAddress: string;
};

export interface JWTPayload extends JwtPayload, UserData {}
