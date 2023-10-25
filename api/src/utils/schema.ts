import Joi from 'joi';
import { UserRole } from '../types/Auth';
import { AppointmentStatus } from '../types/Appointment';

// common

export const idSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

// auth
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
    .pattern(/\d+/, { name: 'Must contain at least 1 number.' })
    .pattern(/[^A-Za-z0-9\s]+/, {
      name: 'Must contain at least 1 special character.',
    })
    .required(),
});

// user
export const userDoctorSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  title: Joi.string().trim().required(),
  speciality: Joi.string().trim().required(),
  officeName: Joi.string().trim().required(),
  officeLocation: Joi.string().trim().required(),
});

export const userPatientSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  dob: Joi.string().trim().required(),
});

// appointment

export const appointmentSchema = Joi.object({
  doctorId: Joi.string().uuid().required(),
  createdBy: Joi.string().uuid().required(),
  description: Joi.string().trim().required(),
  dateOfAppointment: Joi.string().dataUri().required(),
  status: Joi.string().allow(...Object.values(AppointmentStatus)),
});
