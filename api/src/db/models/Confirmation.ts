import {
  Table,
  Column,
  Model,
  AllowNull,
  PrimaryKey,
  Default,
  DataType,
  ForeignKey,
  Unique,
} from 'sequelize-typescript';
import Credential from './Credential';

@Table({
  timestamps: true,
})
export default class Confirmation extends Model {
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Unique
  @ForeignKey(() => Credential)
  @Column({
    allowNull: false,
    type: DataType.UUID,
    onDelete: 'CASCADE',
  })
  credentialId: string;

  @AllowNull(false)
  @Column
  code: number;
}
