import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType
} from 'sequelize-typescript';
import { Order } from './order.model';

@Table
export class ChargingOrder extends Model {
  @ForeignKey(() => Order)
  @Column({ primaryKey: true })
  id: number;

  @Column({
    type: DataType.DATE,
    defaultValue: Date.now,
    allowNull: false,
  })
  startAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: null,
    allowNull: true,
  })
  endAt: Date;

  @Column({
    type: DataType.VIRTUAL,
    get(this: ChargingOrder): number | null {
      if (this.startAt && this.endAt) {
        const durationMs = new Date(this.endAt).getTime() - new Date(this.startAt).getTime();
        return Math.floor(durationMs / 60000); // convert ms to minutes
      }
      return null;
    }
  })
  durationMinutes: number;
}
