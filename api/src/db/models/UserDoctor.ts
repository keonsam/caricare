import {
  AllowNull,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Credential from './Credential';

@Table({
  timestamps: true,
})
export default class UserDoctor extends Model {
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Credential)
  @AllowNull(false)
  @Column(DataType.UUID)
  credentialId: string;

  @AllowNull(false)
  @Column
  firstName: string;

  @AllowNull(false)
  @Column
  lastName: string;

  @AllowNull(false)
  @Column
  title: string;

  @AllowNull(false)
  @Column
  speciality: string;

  @AllowNull(false)
  @Column
  officeName: string;

  @AllowNull(false)
  @Column
  officeLocation: string;
}
