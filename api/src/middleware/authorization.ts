import { UnAuthorizedError } from '../types/ApplicationError';
import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../types/Auth';

export const authorization =
  (roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    if (!roles.includes(user.role)) {
      throw new UnAuthorizedError('Unauthorized: invalid user role');
    }

    next();
  };
