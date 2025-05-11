import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/user/user.model';

@Table
export class Token extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:true
  })
  signature: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue:false
  })
  revoked: boolean;

  @ForeignKey(()=>User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: boolean;


//   relations
  @BelongsTo(()=>User)
  user:User;
}