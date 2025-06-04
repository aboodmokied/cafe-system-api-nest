import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Expenses } from './expenses.model';
import { SupplierExpenses } from './supplier-expenses.model';

@Module({
  imports:[SequelizeModule.forFeature([Expenses,SupplierExpenses])],
  providers: [ExpensesService],
  controllers: [ExpensesController],
  exports:[ExpensesService]
})
export class ExpensesModule {}
