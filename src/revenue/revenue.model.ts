// order.model.ts
import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';
import { SubscriperRevenue } from './subscriper-revenue.model';
import { GuestRevenue } from './guest-revenue.model';
import { PointRevenue } from './point-revenue.model';
import { CustomModel } from 'src/custom-model/custom-model';


@Table({
    tableName: 'revenues',
    timestamps: true,
    createdAt: 'date',
})
export class Revenue extends CustomModel {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
   type: DataType.STRING,
   allowNull: false
   })  
  type: 'GUEST' | 'SUBSCRIPER' | 'POINT';

  @Column({type:DataType.INTEGER,allowNull:true})
  userId: number; // This will refer to either Subscriper or SalesPoint depending on type

  @Column({type:DataType.DOUBLE,allowNull:false})
  amount:number;

  @HasOne(() => SubscriperRevenue)
  subscriperRevenue: SubscriperRevenue;

  @HasOne(() => GuestRevenue)
  guestRevenue: GuestRevenue;

  @HasOne(() => PointRevenue)
  pointRevenue: PointRevenue;

}
