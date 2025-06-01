import { Injectable } from '@nestjs/common';
import { AddGuestRevenueDto, AddSubscriperRevenueDto } from './revenue.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Revenue } from './revenue.model';
import { SubscriperRevenue } from './subscriper-revenue.model';
import { GuestRevenue } from './guest-revenue.model';
import { Op } from 'sequelize';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class RevenueService {
    constructor(
        @InjectModel(Revenue) private revenueModel:typeof Revenue,
        @InjectModel(SubscriperRevenue) private subscriperRevenueModel:typeof SubscriperRevenue,
        @InjectModel(GuestRevenue) private guestRevenueModel:typeof GuestRevenue,
    ){}
    
    async addSubscriperRevenue(addRevenueDto:AddSubscriperRevenueDto){
        const {amount,billingId,subscriperId,type,date}=addRevenueDto;
        // create Revenue
        const revenue=await this.revenueModel.create({
            type,
            amount,
            date,
            userId:subscriperId
        });
        // create subscriper revenue
        const subscriperRevenue=await this.subscriperRevenueModel.create({
            id:revenue.id,
            subscriperId,
            billingId
        });
        revenue.subscriperRevenue=subscriperRevenue;
        return revenue;
    };

    async addGuestRevenue(addRevenueDto:AddGuestRevenueDto){
        const {amount,type,date,sessionId,username}=addRevenueDto;
        // create Revenue
        const revenue=await this.revenueModel.create({
            type,
            amount,
            date
        });
        // create guest revenue
        const guestRevenue=await this.guestRevenueModel.create({
            id:revenue.id,
            sessionId,
            username
        });
        revenue.guestRevenue=guestRevenue;
        return revenue;
    };
    

    async getRevenuesByDate(startDate?: Date, endDate?: Date) {
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

        const revenues = await this.revenueModel.findAll({
            where: whereClause,
            include: [
            { model: GuestRevenue, required: false },
            { model: SubscriperRevenue, required: false },
            //TODO: { model: PointRevenue, required: false },
            ],
            order: [['date', 'DESC']],
        });

        return revenues;
    }


    async getRevenuesBySpecificDay(date: Date) {
        const start = startOfDay(date);
        const end = endOfDay(date);

        const revenues = await this.revenueModel.findAll({
            where: {
            date: {
                [Op.between]: [start, end],
            },
            },
            include: [
            { model: GuestRevenue, required: false },
            { model: SubscriperRevenue, required: false },
            //TODO: { model: PointRevenue, required: false },
            ],
            order: [['date', 'DESC']],
        });

        return revenues;
    }

    
    async getRevenuesByUser(userId: number) {
        const revenues = await this.revenueModel.findAll({
            where: { userId },
            include: [
            { model: SubscriperRevenue, required: false },
            { model: GuestRevenue, required: false },
            //TODO: { model: PointRevenue, required: false },
            ],
            order: [['date', 'DESC']],
        });

        return revenues;
    }


}
