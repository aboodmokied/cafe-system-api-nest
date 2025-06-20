import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './order.model';
import { CardOrder } from './card-order.model';
import { ChargingOrder } from './charging-order.model';
import { OtherOrder } from './other-order.model';
import { AuthModule } from 'src/auth/auth.module';
import { CardModule } from 'src/card/card.module';
import { BillingModule } from 'src/billing/billing.module';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [
    AuthModule,
    CardModule,
    BillingModule,
    SessionModule,
    SequelizeModule.forFeature([Order, CardOrder, ChargingOrder, OtherOrder]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
