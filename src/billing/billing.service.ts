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

    async billingPayment(billingPaymentDto:BillingPaymentDto){
        const {billingId,amount}=billingPaymentDto;
        const billingWithTotal=await this.billingModel.findOne({
            where:{id:billingId},
            attributes: {
                include: [
                    [
                    literal(`(
                        SELECT COALESCE(SUM(orders.price), 0)
                        FROM sessions
                        JOIN orders ON orders.sessionId = sessions.id
                        WHERE sessions.billingId = Billing.id
                    )`),
                    'totalPrice'
                    ]
                ]
            },
        })
        if(!billingWithTotal){
            throw new NotFoundException('billing not found');
        }
        // turn the result into js object
        const billing:BillingWithTotal=billingWithTotal.get({ plain: true });
        // check if already paid
        if(billing.paidAmount==billing.totalPrice){
            throw new BadRequestException(['الفاتورة مسددة بالفعل']);
        }
        // check the amount over than the required amount
        const temp=billing.paidAmount+amount;
        if(temp>billing.totalPrice){
            throw new BadRequestException(['المبلغ المدخل اكبر من المبلغ المطلوب']);
        }else if(temp==billing.totalPrice){
            billingWithTotal.isPaid=true;
        }
        // update paid amount
        billingWithTotal.paidAmount=temp;
        billingWithTotal.save();

        // TODO: add incomes transaction
        
        return billingWithTotal;
    }
}
