import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Session } from './session.model';
import { BillingModule } from 'src/billing/billing.module';
import { SubscriperModule } from 'src/subscriper/subscriper.module';

@Module({
  imports:[SequelizeModule.forFeature([Session]),AuthModule,BillingModule,SubscriperModule],
  controllers: [SessionController],
  providers: [SessionService],
  exports:[SessionService]
})
export class SessionModule {}
