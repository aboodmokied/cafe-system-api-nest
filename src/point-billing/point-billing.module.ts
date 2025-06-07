import { Module } from '@nestjs/common';
import { PointBillingService } from './point-billing.service';
import { PointBillingController } from './point-billing.controller';
import { RevenueModule } from 'src/revenue/revenue.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { PointBilling } from './point-billing.model';

@Module({
  imports:[SequelizeModule.forFeature([PointBilling]),RevenueModule],
  providers: [PointBillingService],
  controllers: [PointBillingController],
  exports:[PointBillingService]
})
export class PointBillingModule {}
