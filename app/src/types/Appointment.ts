import { Doctor, Patient } from "./User";

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'canceled'
  | 'done';

export type Appointment = {
  id: string;
  doctorId: string;
  doctor: Doctor
  patientId: string;
  patient: Patient
  description: string;
  dateOfAppointment: string;
  status: AppointmentStatus;
};

export type AppointmentForm = {
  doctorId: string;
  description: string;
  dateOfAppointment: string;
};

export type Appointments = {
  total: number,
  data: Appointment[]
}
