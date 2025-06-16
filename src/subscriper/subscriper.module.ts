import { Module } from '@nestjs/common';
import { SubscriperService } from './subscriper.service';
import { SubscriperController } from './subscriper.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subscriper } from './subscriper.model';
import { Billing } from 'src/billing/billing.model';

@Module({
  imports:[AuthModule,SequelizeModule.forFeature([Subscriper,Billing])],
  providers: [SubscriperService],
  controllers: [SubscriperController],
  exports:[SubscriperService]
})
export class SubscriperModule {}
