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
    comment: 'Charging duration in minutes',
  })
  durationMinutes: number;
}


