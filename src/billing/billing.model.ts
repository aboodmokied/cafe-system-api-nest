import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Subscriper } from 'src/subscriper/subscriper.model';

@Table({ tableName: 'billing' })
export class Billing extends Model {
  @ForeignKey(() => Subscriper)
  @Column({ type: DataType.INTEGER })
  subscriperId: number;

  @BelongsTo(() => Subscriper)
  subscriper: Subscriper;

  @Column({ type: DataType.DATE, allowNull: false })
  startDate: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  endDate: Date;

  @Column({ type: DataType.ENUM('weekly', 'monthly'), allowNull: false })
  type: 'weekly' | 'monthly';

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPaid: boolean;
}
