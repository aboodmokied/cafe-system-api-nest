import { Module } from '@nestjs/common';
import { SupplierBillingService } from './supplier-billing.service';
import { SupplierBillingController } from './supplier-billing.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SupplierBilling } from './supplier-billing.model';

@Module({
  imports:[SequelizeModule.forFeature([SupplierBilling])],
  providers: [SupplierBillingService],
  controllers: [SupplierBillingController],
  exports:[SupplierBillingService]
})
export class SupplierBillingModule {}
