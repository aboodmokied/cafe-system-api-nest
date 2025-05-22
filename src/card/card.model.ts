import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Card extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:true
  })
  label: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue:0
  })
  qty: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  hours: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue:'-'
  })
  speed: string;



}