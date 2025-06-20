import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { Session } from 'src/session/session.model';
import { Subscriper } from 'src/subscriper/subscriper.model';

@Table({ tableName: 'billings' })
export class Billing extends CustomModel {
  @ForeignKey(() => Subscriper)
  @Column({ type: DataType.INTEGER })
  subscriperId: number;

  @BelongsTo(() => Subscriper)
  subscriper: Subscriper;

  @Column({ type: DataType.DATE, allowNull: false })
  startDate: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  endDate: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  type: 'weekly' | 'monthly';

  @Column({ type: DataType.DOUBLE, defaultValue: 0.0 })
  totalAmount: number;

  @Column({ type: DataType.DOUBLE, defaultValue: 0.0 })
  paidAmount: number;
  
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPaid: boolean;

  @HasMany(()=>Session)
  sessions:Session[];
}

        
