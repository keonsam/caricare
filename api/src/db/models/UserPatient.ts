import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
})
export default class UserPatient extends Model {
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column
  firstName: string;

  @AllowNull(false)
  @Column
  lastName: string;

  @AllowNull(false)
  @Column
  dob: string;
}
