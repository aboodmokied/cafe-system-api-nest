import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from './card.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[AuthModule,SequelizeModule.forFeature([Card])],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService]
})
export class CardModule {}
