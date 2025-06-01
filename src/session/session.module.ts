import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Session } from './session.model';
import { BillingModule } from 'src/billing/billing.module';
import { SubscriperModule } from 'src/subscriper/subscriper.module';
import { RevenueModule } from 'src/revenue/revenue.module';
import { Order } from 'src/order/order.model';

@Module({
  imports:[SequelizeModule.forFeature([Session,Order]),AuthModule,BillingModule,SubscriperModule,RevenueModule],
  controllers: [SessionController],
  providers: [SessionService],
  exports:[SessionService]
})
export class SessionModule {}
