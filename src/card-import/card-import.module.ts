import { Module } from '@nestjs/common';
import { CardImportService } from './card-import.service';

@Module({
  providers: [CardImportService]
})
export class CardImportModule {}
