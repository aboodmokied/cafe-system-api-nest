import { Module } from '@nestjs/common';
import { RevenueController } from './revenue.controller';
import { RevenueService } from './revenue.service';
import { Sequelize } from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { Revenue } from './revenue.model';
import { SubscriperRevenue } from './subscriper-revenue.model';
import { GuestRevenue } from './guest-revenue.model';
import { PointRevenue } from './point-revenue.model';

@Module({
  imports:[SequelizeModule.forFeature([Revenue,SubscriperRevenue,GuestRevenue,PointRevenue])],
  controllers: [RevenueController],
  providers: [RevenueService],
  exports:[RevenueService]
})
export class RevenueModule {}
