import { UnAuthorizedError } from '../types/ApplicationError';
import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../types/Auth';

export const authorization =
  (roles: UserRole[], verifyUser = true) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    if (!roles.includes(user.role)) {
      throw new UnAuthorizedError('Unauthorized: invalid user role');
    }

    if (verifyUser && !user.info?.id) {
      return new UnAuthorizedError(
        'Unauthorized: please create a user profile before you continue, "/doctors" or doctor account or "/patients" or patient account',
      );
    }

    next();
  };
