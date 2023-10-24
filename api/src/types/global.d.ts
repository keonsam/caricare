import { JWTPayload } from './Auth';

declare global {
  namespace Express {
    export interface Request {
      user: JWTPayload;
    }
  }
}

export {};
