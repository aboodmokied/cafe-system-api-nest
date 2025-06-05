// order.model.ts
import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Revenue } from './revenue.model';
import { SalesPoint } from 'src/sales-point/sales-point.model';
import { PointBilling } from 'src/point-billing/point-billing.model';


@Table({
    tableName: 'point_revenues',
    timestamps: true,
})
export class PointRevenue extends Model {
  @ForeignKey(() => Revenue)
  @Column({ primaryKey: true })
  id: number;

  
  @ForeignKey(() => SalesPoint)
  @Column
  pointId: number;

  @ForeignKey(() => PointBilling)
  @Column
  pointBillingId: number; 

}
