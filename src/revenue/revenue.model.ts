// order.model.ts
import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';
import { SubscriperRevenue } from './subscriper-revenue.model';
import { GuestRevenue } from './guest-revenue.model';


@Table({
    tableName: 'revenues',
    timestamps: true,
    createdAt: 'date',
})
export class Revenue extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
   type: DataType.ENUM('GUEST', 'SUBSCRIPER', 'POINT'),
   allowNull: false
   })  
  type: 'GUEST' | 'SUBSCRIPER' | 'POINT';

  @Column({type:DataType.NUMBER,allowNull:true})
  userId: number; // This will refer to either Subscriper or SalesPoint depending on type

  @Column({type:DataType.DOUBLE,allowNull:false})
  amount:number;

  @HasOne(() => SubscriperRevenue)
  subscriperRevenue: SubscriperRevenue;

  @HasOne(() => GuestRevenue)
  guestRevenue: GuestRevenue;

}
