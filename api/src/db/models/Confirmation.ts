import {
  Table,
  Column,
  Model,
  AllowNull,
  PrimaryKey,
  Default,
  DataType,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
})
export default class Confirmation extends Model {
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column
  credentialId: string;

  @AllowNull(false)
  @Column
  code: number;
}
