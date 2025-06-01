// order.model.ts
import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Revenue } from './revenue.model';
import { Session } from 'src/session/session.model';


@Table({
    tableName: 'guest_revenues',
    timestamps: true,
})
export class GuestRevenue extends Model {
  @ForeignKey(() => Revenue)
  @Column({ primaryKey: true })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @ForeignKey(() => Session)
  @Column
  sessionId: number; 

}
