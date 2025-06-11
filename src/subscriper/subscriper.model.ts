// import { Model } from 'sequelize';
import { Table, Column, DataType, HasMany,Model } from 'sequelize-typescript';
import { Billing } from 'src/billing/billing.model';
import { CustomModel } from 'src/custom-model/custom-model';

@Table
export class Subscriper extends CustomModel {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:true
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.ENUM('weekly', 'monthly'),
    allowNull: false,
  })
  type: 'monthly'|'weekly';

  
  @HasMany(() => Billing)
  billings: Billing[];

  getBillingsCount(){
    return Billing.count({where:{subscriperId:this.id}})
  }

  // static async findWithPagination(page:number,limit:number,otherOptions:any={}){
  //       const offset = (page - 1) * limit;
  //       const data = await this.findAll({
  //           limit,
  //           offset,
  //           ...otherOptions
  //       });

  //       const {where}=otherOptions;
  //       const count = await this.count({
  //           where
  //       });

  //       const totalPages = Math.ceil(count / limit);

  //       return{
  //           data,
  //           pagination: {
  //               page,
  //               limit,
  //               totalPages,
  //           },
  //       }
  //   }
}