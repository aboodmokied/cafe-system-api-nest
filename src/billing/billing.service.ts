import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Billing } from './billing.model';
import { startOfDay } from 'date-fns';
import { BillingPaymentDto, CreateBillingDto } from './billing.dto';
import { literal } from 'sequelize';

type BillingWithTotal = Billing & { totalPrice: number };

@Injectable()
export class BillingService {
    constructor(@InjectModel(Billing) private billingModel:typeof Billing){}

    async getLatestValidBillingByDay(subscriperId: number,type:'weekly'|'monthly'): Promise<Billing | null> {
        const billing = await this.billingModel.findOne({
            where: { subscriperId },
            order: [['endDate', 'DESC']]
        });

        if(billing){
            const today = startOfDay(new Date()); // وقت اليوم = 00:00:00
            const endDay = startOfDay(new Date(billing.endDate)); // وقت نهاية الدورة
            if(endDay > today){
                return billing;
            }
        }
        return this.createNewBilling({subscriperId,type});
    }

    async createNewBilling(createBillingDto:CreateBillingDto){
        const {subscriperId,type}=createBillingDto;
        const startDate = new Date();
        const endDate = new Date(startDate);
        if (type === 'weekly') {
            endDate.setDate(startDate.getDate() + 7);
        } else {
            endDate.setMonth(startDate.getMonth() + 1);
        }

        return this.billingModel.create({
            subscriperId,
            startDate,
            endDate,
            type,
            isPaid: false
        });
    }

    async updateBillingTotalAmount(billingId:number,amount:number,action:'INC'|'DEC'){
        if(action=='INC'){
            await this.billingModel.increment('totalAmount',{
                by:amount,
                where:{id:billingId}
            })
        }else{
            await this.billingModel.decrement('totalAmount',{
                by:amount,
                where:{id:billingId}
            })
        }
    }

    async billingPayment(billingPaymentDto:BillingPaymentDto){
        const {billingId,amount}=billingPaymentDto;
        const billing=await this.billingModel.findByPk(billingId);
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

        // TODO: add incomes transaction
        
        return billing;
    }
}
