import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';
import { SupplierExpenses } from './supplier-expenses.model';


@Table({
    tableName: 'expenses',
    timestamps: true,
    createdAt: 'date',
})
export class Expenses extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
   type: DataType.STRING,
   allowNull: false
   })  
  type: 'SUPPLIER';

  @Column({type:DataType.INTEGER,allowNull:true})
  userId: number;

  @Column({type:DataType.DOUBLE,allowNull:false})
  amount:number;

  @HasOne(() => SupplierExpenses)
  supplierExpenses: SupplierExpenses;


}
