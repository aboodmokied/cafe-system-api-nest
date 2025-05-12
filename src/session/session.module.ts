import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Session } from './session.model';

@Module({
  imports:[SequelizeModule.forFeature([Session]),AuthModule],
  controllers: [SessionController],
  providers: [SessionService]
})
export class SessionModule {}
