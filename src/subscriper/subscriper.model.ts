import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Subscriper extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:true
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

}