// order.model.ts
import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Expenses } from './expenses.model';
import { Supplier } from 'src/supplier/supplier.model';
import { SupplierBilling } from 'src/supplier-billing/supplier-billing.model';


@Table({
    tableName: 'supplier_expenses',
    timestamps: true,
})
export class SupplierExpenses extends Model {
  @ForeignKey(() => Expenses)
  @Column({ primaryKey: true })
  id: number;

  
  @ForeignKey(() => Supplier)
  @Column
  supplierId: number;

  @ForeignKey(() => SupplierBilling)
  @Column
  supplierBillingId: number; 

}
