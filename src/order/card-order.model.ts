// card-order.model.ts
import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Order } from './order.model';
import { Card } from 'src/card/card.model';

@Table
export class CardOrder extends Model {
  @ForeignKey(() => Order)
  @Column({ primaryKey: true })
  id: number;

  @ForeignKey(() => Card)
  @Column
  cardId: number;

  // @Column({type:DataType.DOUBLE,allowNull:false})
  // price:number;

}
