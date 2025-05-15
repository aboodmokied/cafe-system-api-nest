// card-order.model.ts
import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Order } from './order.model';

@Table
export class OtherOrder extends Model {
  @ForeignKey(() => Order)
  @Column({ primaryKey: true })
  id: number;

  @Column({type:DataType.STRING})
  description:string;

  @Column({type:DataType.NUMBER,allowNull:false})
  price:number;



}



// write prd for a front end app for cafe managment system: the main points is: ادارة مخزون البطاقات, ادارة اصحاب الاشتركات الشهرية والاسبوعية عرض جميع الجلسات اضافة جلسة واغلاق جلسة عرض طلبات الجلسة قبل اغلاقها امكانية تعديل سعر الطلبات عند الاغلاق, ادارة نقاط البيع 