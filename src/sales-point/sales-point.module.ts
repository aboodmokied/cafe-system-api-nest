import { Module } from '@nestjs/common';
import { SalesPointService } from './sales-point.service';
import { SalesPointController } from './sales-point.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SalesPoint } from './sales-point.model';

@Module({
  imports:[SequelizeModule.forFeature([SalesPoint])],
  providers: [SalesPointService],
  controllers: [SalesPointController]
})
export class SalesPointModule {}
