// card-order.model.ts
import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Order } from './order.model';

@Table
export class CardOrder extends Model {
  @ForeignKey(() => Order)
  @Column({ primaryKey: true })
  id: number;

  @Column
  cardId: number;

  @Column({type:DataType.NUMBER,allowNull:false})
  price:number;

}

// TODO: When Create A Card Modify this model