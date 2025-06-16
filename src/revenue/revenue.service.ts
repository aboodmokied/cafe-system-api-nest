import { Injectable } from '@nestjs/common';
import { AddGuestRevenueDto, AddPointRevenueDto, AddSubscriperRevenueDto } from './revenue.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Revenue } from './revenue.model';
import { SubscriperRevenue } from './subscriper-revenue.model';
import { GuestRevenue } from './guest-revenue.model';
import { Op } from 'sequelize';
import { endOfDay, startOfDay } from 'date-fns';
import sequelize from 'sequelize';
import { PointRevenue } from './point-revenue.model';

@Injectable()
export class RevenueService {
    constructor(
        @InjectModel(Revenue) private revenueModel:typeof Revenue,
        @InjectModel(SubscriperRevenue) private subscriperRevenueModel:typeof SubscriperRevenue,
        @InjectModel(PointRevenue) private pointRevenueModel:typeof PointRevenue,
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

    async addPointRevenue(addRevenueDto:AddPointRevenueDto){
        const {amount,pointBillingId,pointId,type,date}=addRevenueDto;
        // create Revenue
        const revenue=await this.revenueModel.create({
            type,
            amount,
            date,
            userId:pointId
        });
        // create point revenue
        const pointRevenue=await this.pointRevenueModel.create({
            id:revenue.id,
            pointId,
            pointBillingId
        });
        revenue.pointRevenue=pointRevenue;
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
    

    async getRevenuesByDate(options:{startDate?:Date,endDate?:Date,page?:number,limit?:number}) {
        const {startDate,endDate}=options;
        const limit=options.limit || 10;
        const page=options.page || 1;
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

        const {data:revenues,pagination}=await this.revenueModel.findWithPagination(page,limit,{
            where: whereClause,
            include: [
            { model: GuestRevenue, required: false },
            { model: SubscriperRevenue, required: false },
            { model: PointRevenue, required: false },
            ],
            order: [['date', 'DESC']],
        })
        // Fetch total amount separately
        const totalAmountResult = await this.revenueModel.findOne({
            attributes: [[sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"]],
            where: whereClause,
            raw: true,
        });
        const totalAmount = Number((totalAmountResult as any)?.totalAmount || 0);
        return {
            revenues,
            totalAmount,
            pagination
        };
    }


    
    async getRevenuesByUser(userId: number,page=1,limit=10) {
        const {data:revenues,pagination} = await this.revenueModel.findWithPagination(page,limit,{
            where: { userId },
            include: [
            { model: SubscriperRevenue, required: false },
            { model: GuestRevenue, required: false },
            { model: PointRevenue, required: false },
            ],
            order: [['date', 'DESC']],
        });

        return {revenues,pagination};
    }


}
