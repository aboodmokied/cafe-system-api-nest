import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SupplierBilling } from './supplier-billing.model';
import { CreateSupplierBillingDto, SupplierBillingPaymentDto } from './supplier-billing.dto';
import { ExpensesService } from 'src/expenses/expenses.service';

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
}
