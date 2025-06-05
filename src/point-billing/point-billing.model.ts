import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { Card } from 'src/card/card.model';
import { SalesPoint } from 'src/sales-point/sales-point.model';

@Table({ 
    tableName: 'point_billings',
    timestamps: true,
    createdAt: 'date',
 })
export class PointBilling extends Model {
  @ForeignKey(() => SalesPoint)
  @Column({ type: DataType.INTEGER })
  pointId: number;

  @BelongsTo(() => SalesPoint)
  salesPoint: SalesPoint;


  @Column({ type: DataType.DOUBLE, defaultValue: 0.0 })
  totalAmount: number;

  @Column({ type: DataType.DOUBLE, defaultValue: 0.0 })
  paidAmount: number;
  
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPaid: boolean;

  @Column({ type: DataType.INTEGER, allowNull:false })
  cardsCount: number;

 @ForeignKey(() => Card)
  @Column
  cardId: number;

  @BelongsTo(() => Card)
  card: Card;
}

        
