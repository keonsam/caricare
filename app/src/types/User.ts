import { UserRole } from "./Register";

export type User = {
  credentialId: string;
  exp: number;
  role: UserRole;
};
