// order.model.ts
import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';
import { SubscriperReveneue } from './subscriper-revenue.model';
import { GuestReveneue } from './guest-revenue.model';


@Table({
    tableName: 'revenues',
    timestamps: true,
    createdAt: 'date',
})
export class Reveneue extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
   type: DataType.ENUM('GUEST', 'SUBSCRIPER', 'POINT'),
   allowNull: false
   })  
  type: 'GUEST' | 'SUBSCRIPER' | 'POINT';

  @Column
  userId: number; // This will refer to either Subscriper or SalesPoint depending on type

  @Column({type:DataType.DOUBLE,allowNull:false})
  amount:number;

  @HasOne(() => SubscriperReveneue)
  subscriperRevenue: SubscriperReveneue;

  @HasOne(() => GuestReveneue)
  guestReveneue: GuestReveneue;

}
