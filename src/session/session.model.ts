import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Order } from 'src/order/order.model';

@Table
export class Session extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.DATE,
    defaultValue:Date.now
  })
  startAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue:null
  })
  endAt: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue:true
  })
  isActive:boolean
  

  @Column({
    type: DataType.STRING,
    allowNull:false
  })
  clientType:string

  @HasMany(()=>Order)
  orders:Order[]

}
