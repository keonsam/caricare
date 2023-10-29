import { format } from 'date-fns';
import { Doctor, Patient } from '../types/User';

export function formatAppointmentDate(date: string) {
  return format(new Date(date), 'K:mm aaa LLL do yyyy');
}

export function getPatientName(patient: Patient) {
  return `${patient.firstName} ${patient.lastName}`;
}

export function getDateOfBirth(patient: Patient) {
  return format(new Date(patient.dob), 'MM/dd/yyyy');
}

export function getDoctorName(doctor: Doctor) {
  return `${doctor.title} ${doctor.firstName} ${doctor.lastName}`;
}
