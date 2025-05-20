import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from './card.model';

@Module({
  imports:[SequelizeModule.forFeature([Card])],
  providers: [CardService],
  controllers: [CardController]
})
export class CardModule {}
