import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Expenses } from './expenses.model';
import { SupplierExpenses } from './supplier-expenses.model';
import { AddSupplierExpensesDto } from './expenses.dto';
import { Op } from 'sequelize';
import sequelize from 'sequelize';

@Injectable()
export class ExpensesService {
    constructor(
        @InjectModel(Expenses) private expensesModel:typeof Expenses,
        @InjectModel(SupplierExpenses) private supplierExpensesModel:typeof SupplierExpenses,
    ){}

    async addSupplierExpenses(addExpenses:AddSupplierExpensesDto){
            const {amount,supplierBillingId,supplierId,type,date}=addExpenses;
            // create Expenses
            const expenses=await this.expensesModel.create({
                type,
                amount,
                date,
                userId:supplierId
            });
            // create supplier Expenses
            const supplierExpenses=await this.supplierExpensesModel.create({
                id:expenses.id,
                supplierId,
                supplierBillingId
            });
            expenses.supplierExpenses=supplierExpenses;
            return expenses;
        };



        async getExpensesByDate(startDate?: Date, endDate?: Date) {
                const whereClause: any = {};
                if (startDate && endDate) {
                    whereClause.date = {
                    [Op.between]: [startDate, endDate],
                    };
                } else if (startDate) {
                    whereClause.date = {
                    [Op.gte]: startDate,
                    };
                } else if (endDate) {
                    whereClause.date = {
                    [Op.lte]: endDate,
                    };
                }
        
                const expenses = await this.expensesModel.findAll({
                    where: whereClause,
                    include: [
                    { model: SupplierExpenses, required: false },
                    ],
                    order: [['date', 'DESC']],
                });
                // Fetch total amount separately
                const totalAmountResult = await this.expensesModel.findOne({
                    attributes: [[sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"]],
                    where: whereClause,
                    raw: true,
                });
                const totalAmount = Number((totalAmountResult as any)?.totalAmount || 0);
                return {expenses,totalAmount};
            }
}
