import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './order.model';
import { CardOrder } from './card-order.model';
import { ChargingOrder } from './charging-order.model';
import { OtherOrder } from './other-order.model';

@Module({
  imports:[SequelizeModule.forFeature([Order,CardOrder,ChargingOrder,OtherOrder])],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
