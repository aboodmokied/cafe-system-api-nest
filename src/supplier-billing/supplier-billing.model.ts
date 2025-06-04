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
import { Supplier } from 'src/supplier/supplier.model';

@Table({ 
    tableName: 'supplier_billings',
    timestamps: true,
    createdAt: 'date',
 })
export class SupplierBilling extends Model {
  @ForeignKey(() => Supplier)
  @Column({ type: DataType.INTEGER })
  supplierId: number;

  @BelongsTo(() => Supplier)
  supplier: Supplier;


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

        
