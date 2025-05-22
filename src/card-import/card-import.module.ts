import { Module } from '@nestjs/common';
import { CardImportService } from './card-import.service';
import { CardImportController } from './card-import.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { CardImport } from './card-import.model';

@Module({
  imports:[AuthModule,SequelizeModule.forFeature([CardImport])],
  providers: [CardImportService],
  controllers: [CardImportController],
  exports:[CardImportService]
})
export class CardImportModule {}
