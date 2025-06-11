import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Billing } from './billing.model';
import { startOfDay } from 'date-fns';
import { BillingPaymentDto, CreateBillingDto } from './billing.dto';
import { literal } from 'sequelize';
import { RevenueService } from 'src/revenue/revenue.service';
import { Op } from 'sequelize';
import sequelize from 'sequelize';
import { Subscriper } from 'src/subscriper/subscriper.model';

type BillingWithTotal = Billing & { totalPrice: number };

@Injectable()
export class BillingService {
    constructor(
        @InjectModel(Billing) private billingModel:typeof Billing,
        private revenueService:RevenueService
    ){}

    async getLatestValidBillingByDay(subscriperId: number,type:'weekly'|'monthly'): Promise<Billing | null> {
        const billing = await this.billingModel.findOne({
            where: { subscriperId },
            order: [['endDate', 'DESC']]
        });

        if(billing){
            const now = new Date();
            const endDay = new Date(billing.endDate);
            if (endDay > now) {
                return billing;
            }   
        }
        const newBilling=await this.createNewBilling({subscriperId,type});
        return newBilling;
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

        // record a revenue transaction
        await this.revenueService.addSubscriperRevenue({
            type:'SUBSCRIPER',
            amount,
            billingId,
            subscriperId:billing.subscriperId,
            date:new Date(),
        });

        return billing;
    }


async getCollectionBillings(page = 1, limit = 10) {
  const now = new Date();

  const {data:billings,pagination} = await this.billingModel.findWithPagination(page,limit,{
    where: {
      isPaid: false,
      endDate: { [Op.lte]: now },
    },
    include: [
      {
        model: Subscriper,
        attributes: ['username'],
      },
    ],
    order: [['endDate', 'ASC']],
  });

  const totalAmountResult = await this.billingModel.findOne({
    attributes: [[sequelize.literal('SUM(`totalAmount` - `paidAmount`)'), 'totalAmount']],
    where: {
      isPaid: false,
      endDate: { [Op.lte]: now },
    },
    raw: true,
  });

  const totalAmount = totalAmountResult?.totalAmount ?? 0;

  return {
    billings,
    totalAmount,
    pagination
  };
}

}
