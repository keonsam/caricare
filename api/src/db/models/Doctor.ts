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
  Unique,
} from 'sequelize-typescript';
import Credential from './Credential';

@Table({
  timestamps: true,
  tableName: 'health-professionals',
})
export default class Doctor extends Model {
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Credential)
  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    onDelete: 'CASCADE',
  })
  credentialId: string;

  @BelongsTo(() => Credential)
  credential: Credential;

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

  @AllowNull(false)
  @Column
  ipAddress: string;
}
