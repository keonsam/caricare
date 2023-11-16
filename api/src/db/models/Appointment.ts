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
import Doctor from './Doctor';
import Patient from './Patient';
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
  @Column({
    type: DataType.UUID,
    onDelete: 'CASCADE',
  })
  credentialId: string;

  @BelongsTo(() => Credential)
  credential: Credential;

  @ForeignKey(() => Doctor)
  @Column({
    type: DataType.UUID,
    onDelete: 'SET NULL',
  })
  doctorId: string;

  @BelongsTo(() => Doctor, 'doctorId')
  doctor: Doctor;

  @ForeignKey(() => Patient)
  @Column({
    type: DataType.UUID,
    onDelete: 'SET NULL',
  })
  patientId: string;

  @BelongsTo(() => Patient, 'patientId')
  patient: Patient;

  @AllowNull(false)
  @Column
  description: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  dateOfAppointment: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(AppointmentStatus)))
  status: AppointmentStatus;

  @AllowNull(false)
  @Column
  ipAddress: string;
}
