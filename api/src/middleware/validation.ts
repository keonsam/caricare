import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { UserRole } from '../types/Auth';
import { userDoctorSchema, userPatientSchema } from '../utils/schema';

type Property = 'body' | 'query' | 'params';

export const validate =
  (schema: ObjectSchema, property: Property) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (!error) {
      next();
    } else {
      res.status(422).json(error.details);
    }
  };

export const validateProfile = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { user } = req;
  const schema =
    user.role === UserRole.PATIENT ? userPatientSchema : userDoctorSchema;
  const { error } = schema.validate(req['body'], { abortEarly: false });
  if (!error) {
    next();
  } else {
    res.status(422).json(error.details);
  }
};
