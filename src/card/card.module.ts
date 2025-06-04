import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from './card.model';
import { AuthModule } from 'src/auth/auth.module';
import { CardImportModule } from 'src/card-import/card-import.module';
import { SupplierBillingModule } from 'src/supplier-billing/supplier-billing.module';
import { ExpensesModule } from 'src/expenses/expenses.module';

@Module({
  imports:[AuthModule,SequelizeModule.forFeature([Card]),CardImportModule,SupplierBillingModule,ExpensesModule],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService]
})
export class CardModule {}
