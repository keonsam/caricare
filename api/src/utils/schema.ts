import Joi from 'joi';
import { UserRole } from '../types/Auth';

export const authSchema = Joi.object({
  username: Joi.string().trim().email().required(),
  password: Joi.string()
    .trim()
    .min(12)
    .max(25)
    .pattern(/\d+/, { name: 'must contain at least 1 number' })
    .pattern(/[^A-Za-z0-9\s]+/, {
      name: 'must contain at least 1 special character',
    })
    .required(),
  role: Joi.string()
    .allow(...Object.values(UserRole))
    .required(),
});

export const confirmSchema = Joi.object({
  id: Joi.string().uuid().required(),
  code: Joi.number().min(100000).max(999999).required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().trim().email().required(),
  password: Joi.string()
    .trim()
    .min(12)
    .max(25)
    .pattern(/\d+/, { name: 'must contain at least 1 number' })
    .pattern(/[^A-Za-z0-9\s]+/, {
      name: 'must contain at least 1 special character',
    })
    .required(),
});
