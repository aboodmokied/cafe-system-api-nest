import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Supplier } from './supplier.model';

@Module({
  imports:[AuthModule,SequelizeModule.forFeature([Supplier])],
  controllers: [SupplierController],
  providers: [SupplierService]
})
export class SupplierModule {}
