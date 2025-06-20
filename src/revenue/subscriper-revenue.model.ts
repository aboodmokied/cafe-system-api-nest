// order.model.ts
import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Revenue } from './revenue.model';
import { Subscriper } from 'src/subscriper/subscriper.model';
import { Billing } from 'src/billing/billing.model';


@Table({
    tableName: 'subscriper_revenues',
    timestamps: true,
})
export class SubscriperRevenue extends Model {
  @ForeignKey(() => Revenue)
  @Column({ primaryKey: true })
  id: number;

  
  @ForeignKey(() => Subscriper)
  @Column
  subscriperId: number;

  @ForeignKey(() => Billing)
  @Column
  billingId: number; 

}
