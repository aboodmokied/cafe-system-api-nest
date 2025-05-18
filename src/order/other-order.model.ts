// card-order.model.ts
import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Order } from './order.model';

@Table
export class OtherOrder extends Model {
  @ForeignKey(() => Order)
  @Column({ primaryKey: true })
  id: number;

  @Column({type:DataType.STRING})
  title:string;

  // @Column({type:DataType.DOUBLE,allowNull:false})
  // price:number;


}



