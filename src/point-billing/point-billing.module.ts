import { Module } from '@nestjs/common';
import { PointBillingService } from './point-billing.service';
import { PointBillingController } from './point-billing.controller';
import { RevenueModule } from 'src/revenue/revenue.module';

@Module({
  imports:[RevenueModule],
  providers: [PointBillingService],
  controllers: [PointBillingController]
})
export class PointBillingModule {}
