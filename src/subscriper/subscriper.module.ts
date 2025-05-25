import { Module } from '@nestjs/common';
import { SubscriperService } from './subscriper.service';
import { SubscriperController } from './subscriper.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subscriper } from './subscriper.model';

@Module({
  imports:[AuthModule,SequelizeModule.forFeature([Subscriper])],
  providers: [SubscriperService],
  controllers: [SubscriperController]
})
export class SubscriperModule {}
