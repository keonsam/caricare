import { Request, Response, NextFunction } from 'express';
import logger from './logger';
import { JWTService } from '../services/jwt.service';
import { UnAuthorizedError } from '../types/ApplicationError';
import { JWTPayload } from '../types/Auth';

const jwtService = new JWTService();

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorization = req.header('authorization');

    if (!authorization) {
      throw new UnAuthorizedError('Authorization header not found');
    }

    if (!authorization.startsWith('Bearer ')) {
      throw new UnAuthorizedError(
        "Token must be prefixed with Bearer example: 'Bearer {token}'",
      );
    }
    const token = authorization.substring(7);

    logger.info('token retrieved from headers');

    const user = jwtService.decodeJWT(token);

    if (!user || typeof user === 'string') {
      throw new UnAuthorizedError('Token is invalid or expired');
    }

    req.user = user as JWTPayload;

    next();
  } catch (e) {
    if (e instanceof Error && e.message === 'jwt expired') {
      throw new UnAuthorizedError('jwt has expired');
    }
    next(e);
  }
};
