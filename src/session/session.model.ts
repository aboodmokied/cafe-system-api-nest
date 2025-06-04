import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Billing } from 'src/billing/billing.model';
import { Order } from 'src/order/order.model';
import { Subscriper } from 'src/subscriper/subscriper.model';

@Table({ tableName: 'sessions' })
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
    type: DataType.ENUM('GUEST', 'SUBSCRIPER'),
    allowNull:false
  })
  clientType:string

  @ForeignKey(() => Subscriper)
  @Column({ type: DataType.INTEGER, allowNull:true })
  subscriperId: number;

  @BelongsTo(() => Subscriper)
  subscriper: Subscriper;

  @ForeignKey(() => Billing)
  @Column({ type: DataType.INTEGER, allowNull:true })
  billingId: number;

  @BelongsTo(() => Billing)
  billing: Billing;

  @HasMany(()=>Order)
  orders:Order[]

}
