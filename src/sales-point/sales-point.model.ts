import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { PointBilling } from 'src/point-billing/point-billing.model';

@Table({
    tableName:'sales_points'
})
export class SalesPoint extends CustomModel {
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

  @HasMany(()=>PointBilling)
  pointBillings:PointBilling[];

  getBillingsCount(){
    return PointBilling.count({where:{pointId:this.id}})
  }
}