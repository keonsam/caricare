import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Credential from './Credential';
import UserDoctor from './UserDoctor';
import UserPatient from './UserPatient';
import { AppointmentStatus } from '../../types/Appointment';

@Table({
  timestamps: true,
})
export default class Appointment extends Model {
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Credential)
  @AllowNull(false)
  @Column(DataType.UUID)
  credentialId: string;

  @ForeignKey(() => UserDoctor)
  @AllowNull(false)
  @Column(DataType.UUID)
  doctorId: string;

  @BelongsTo(() => UserDoctor, 'doctorId')
  doctor: UserDoctor;

  @ForeignKey(() => UserPatient)
  @AllowNull(false)
  @Column(DataType.UUID)
  patientId: string;

  @BelongsTo(() => UserPatient, 'patientId')
  patient: UserPatient;

  @AllowNull(false)
  @Column
  description: string;

  @AllowNull(false)
  @Column(DataType.TIME)
  dateOfAppointment: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(AppointmentStatus)))
  status: AppointmentStatus;
}
