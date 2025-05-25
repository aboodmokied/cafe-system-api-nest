import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Billing } from './billing.model';

@Module({
  imports:[SequelizeModule.forFeature([Billing])],
  providers: [BillingService],
  controllers: [BillingController]
})
export class BillingModule {}
