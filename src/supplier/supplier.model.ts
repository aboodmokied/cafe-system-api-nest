import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { SupplierBilling } from 'src/supplier-billing/supplier-billing.model';

@Table
export class Supplier extends CustomModel {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number;

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

  @HasMany(()=>SupplierBilling)
  supplierBillings:SupplierBilling[];

  getBillingsCount(){
      return SupplierBilling.count({where:{supplierId:this.id}})
    }
}