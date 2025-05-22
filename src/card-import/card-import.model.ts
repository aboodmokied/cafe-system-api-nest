import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Card } from 'src/card/card.model';
import { Supplier } from 'src/supplier/supplier.model';

@Table({
  tableName: 'card_imports',
  timestamps: true,
  createdAt: 'importedAt',
  updatedAt: false,
})
export class CardImport extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number;

  @ForeignKey(() => Card)
  @Column(DataType.INTEGER)
  cardId: number;

  @ForeignKey(() => Supplier)
  @Column(DataType.INTEGER)
  supplierId: number;

  @Column(DataType.INTEGER)
  qty: number;

  @Column(DataType.DOUBLE)
  totalPrice: number;

  @Column(DataType.DOUBLE)
  paidPrice: number;

  @BelongsTo(() => Card)
  card: Card;

  @BelongsTo(() => Supplier)
  supplier: Supplier;

  @Column({
    type: DataType.INTEGER,
    allowNull:false
  })
  qtyBeforeImport: number;

  // ✅ الكمية بعد الاستيراد - Virtual
  @Column({
    type: DataType.VIRTUAL,
    get(this: CardImport) {
      const before = (this as any)._qtyBeforeImport ?? 0;
      return before + this.qty;
    },
  })
  qtyAfterImport: number;
}
