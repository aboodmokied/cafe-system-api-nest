import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Session extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.DATE,
    defaultValue:Date.now
  })
  startAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue:null
  })
  endAt: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue:true
  })
  isActive:boolean
  
}

// TODO: Assosiate with Subscriber and Order 