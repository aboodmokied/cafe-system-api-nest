import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Billing } from 'src/billing/billing.model';

@Table
export class Subscriper extends Model {
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

}