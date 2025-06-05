import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { SupplierBilling } from 'src/supplier-billing/supplier-billing.model';

@Table({
    tableName:'sales_points'
})
export class SalesPoint extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:true
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

//   @HasMany(()=>SupplierBilling)
//   supplierBillings:SupplierBilling[];
}