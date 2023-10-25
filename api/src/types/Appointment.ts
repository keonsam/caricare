export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in-progress',
  CANCELED = 'canceled',
  DONE = 'done',
}

export type Appointment = {
  doctorId: string;
  patientId: string;
  credentialId: string;
  description: string;
  dateOfAppointment: string;
  status: AppointmentStatus;
};
