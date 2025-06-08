import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SupplierBilling } from './supplier-billing.model';
import { CreateSupplierBillingDto, SupplierBillingPaymentDto } from './supplier-billing.dto';
import { ExpensesService } from 'src/expenses/expenses.service';
import { Supplier } from 'src/supplier/supplier.model';
import sequelize from 'sequelize';
import { Card } from 'src/card/card.model';

@Injectable()
export class SupplierBillingService {
    constructor(
        @InjectModel(SupplierBilling) private supplierBillingModel:typeof SupplierBilling,
        private expensesService:ExpensesService
    ){}

    async createSupplierBilling(createSupplierBiliingDto:CreateSupplierBillingDto){
        const supplierBilling=await this.supplierBillingModel.create({...createSupplierBiliingDto});
        return supplierBilling;
    }

    async supplierBillingPayment(billingPaymentDto:SupplierBillingPaymentDto){
            const {supplierBillingId,amount}=billingPaymentDto;
            const billing=await this.supplierBillingModel.findByPk(supplierBillingId);
            if(!billing){
                throw new NotFoundException('billing not found');
            }
            // check if already paid
            if(billing.isPaid){
                throw new BadRequestException(['الفاتورة مسددة بالفعل']);
            }
            // check the amount over than the required amount
            const temp=billing.paidAmount+amount;
            if(temp>billing.totalAmount){
                throw new BadRequestException(['المبلغ المدخل اكبر من المبلغ المطلوب']);
            }else if(temp==billing.totalAmount){
                billing.isPaid=true;
            }
            // update paid amount
            billing.paidAmount=temp;
            billing.save();
    
            // record a expenses transaction
            await this.expensesService.addSupplierExpenses({
                type:'SUPPLIER',
                amount,
                date:new Date(),
                supplierBillingId,
                supplierId:billing.supplierId
            })
            return billing;
        }

        async getCollectionBillings(page = 1, limit = 10) {
            const offset = (page - 1) * limit;
        
            const billings = await this.supplierBillingModel.findAll({
            where: {
                isPaid: false,
            },
            include: [
                {
                model: Supplier,
                attributes: ['name'],
                },
                {
                model: Card,
                },
            ],
            limit,
            offset,
            order: [['date', 'DESC']],
            });
        
            const totalAmountResult = await this.supplierBillingModel.findOne({
            attributes: [[sequelize.literal('SUM(`totalAmount` - `paidAmount`)'), 'totalAmount']],
            where: {
                isPaid: false,
            },
            raw: true,
            });
        
            const totalAmount = totalAmountResult?.totalAmount ?? 0;
        
            const count = await this.supplierBillingModel.count({
            where: {
                isPaid: false,
            },
            });
        
            const totalPages = Math.ceil(count / limit);
        
            return {
                billings,
                totalAmount,
                pagination: {
                    page,
                    limit,
                    totalPages,
                },
            };
        }
}
