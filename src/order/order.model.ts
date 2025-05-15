// order.model.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript';
import { CardOrder } from './card-order.model';
import { ChargingOrder } from './charging-order.model';
import { OtherOrder } from './other-order.model';
import { Session } from 'src/session/session.model';

@Table
export class Order extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => Session)
  @Column
  sessionId: number;

  @Column(DataType.ENUM('card', 'charging', 'other'))
  type: 'card' | 'charging' | 'other';

  @Column
  totalAmount: number;

  @BelongsTo(() => Session)
  session: Session;

  @HasOne(() => CardOrder)
  cardOrder: CardOrder;

  @HasOne(() => ChargingOrder)
  chargingOrder: ChargingOrder;

  @HasOne(() => OtherOrder)
  otherOrder: OtherOrder;
}
