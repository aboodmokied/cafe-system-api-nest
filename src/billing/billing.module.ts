import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Billing } from './billing.model';
import { RevenueModule } from 'src/revenue/revenue.module';

@Module({
  imports:[SequelizeModule.forFeature([Billing]),RevenueModule],
  providers: [BillingService],
  controllers: [BillingController],
  exports:[BillingService]
})
export class BillingModule {}
