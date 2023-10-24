export type UserRole = 'patient' | 'doctor';

export type RegisterForm = {
  username: string;
  password: string;
  role: UserRole;
};

export type RegisterResponse = {
  confirmationId: string;
};
