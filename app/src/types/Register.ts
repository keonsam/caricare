export type UserRole = 'patient' | 'doctor' | 'nurse';

export type RegisterForm = {
  username: string;
  password: string;
  role: UserRole;
};

export type RegisterResponse = {
  confirmationId: string;
};
