// card-order.model.ts
import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Order } from './order.model';

@Table
export class ChargingOrder extends Model {
  @ForeignKey(() => Order)
  @Column({ primaryKey: true })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  durationMinutes: number;

  @Column({
    type: DataType.DATE,
    defaultValue:Date.now
  })
  startAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue:null
  })
  endAt: Date;

  // @Column({
  //   type: DataType.DOUBLE,
  //   defaultValue:0.0,
  // })
  // price: number;
}


