import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Billing } from './billing.model';
import { startOfDay } from 'date-fns';
import { CreateBillingDto } from './billing.dto';

@Injectable()
export class BillingService {
    constructor(@InjectModel(Billing) private billingModel:typeof Billing){}

    async getLatestValidBillingByDay(userId: number): Promise<Billing | null> {
        const billing = await this.billingModel.findOne({
            where: { userId },
            order: [['endDate', 'DESC']]
        });

        if (!billing) return null;

        const today = startOfDay(new Date()); // وقت اليوم = 00:00:00
        const endDay = startOfDay(new Date(billing.endDate)); // وقت نهاية الدورة

        return endDay > today ? billing : null;
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
}
