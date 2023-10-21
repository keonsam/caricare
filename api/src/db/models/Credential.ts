import {
  Table,
  Column,
  Model,
  AllowNull,
  PrimaryKey,
  Default,
  DataType,
} from 'sequelize-typescript';
import { CredentialStatus, UserRole } from '../../types/Auth';

@Table({
  timestamps: true,
})
export default class Credential extends Model {
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column
  username: string;

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(CredentialStatus)))
  status: CredentialStatus;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(UserRole)))
  role: UserRole;
}
