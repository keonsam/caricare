import Joi from 'joi';
import { UserRole } from '../types/Auth';
import { AppointmentStatus } from '../types/Appointment';

// common

export const idSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const getSchema = Joi.object({
  pageNumber: Joi.number().min(1),
  pageSize: Joi.number().min(1),
  sort: Joi.string().allow('asc', 'desc').only(),
  search: Joi.string().trim(),
  date: Joi.string().isoDate(),
});

// auth

const username = Joi.string().trim().email().required();
const password = Joi.string()
  .trim()
  .min(12)
  .max(25)
  .pattern(/\d+/, { name: 'must contain at least 1 number' })
  .pattern(/[^A-Za-z0-9\s]+/, {
    name: 'must contain at least 1 special character',
  })
  .required();

export const loginSchema = Joi.object({
  username,
  password,
});

export const registerSchema = Joi.object({
  username,
  password,
  role: Joi.string()
    .allow(...Object.values(UserRole))
    .required(),
});

export const confirmSchema = Joi.object({
  id: Joi.string().uuid().required(),
  code: Joi.number().min(100000).max(999999).required(),
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
  address: Joi.string().trim().required(),
  height: Joi.number().optional(),
  weight: Joi.number().optional(),
});

// appointment

export const appointmentSchema = Joi.object({
  doctorId: Joi.string().uuid().required(),
  description: Joi.string().trim().required(),
  dateOfAppointment: Joi.string().isoDate().required(),
});

export const updateAppointmentSchema = Joi.object({
  status: Joi.string()
    .allow(...Object.values(AppointmentStatus))
    .required(),
});
