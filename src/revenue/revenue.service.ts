import { Injectable } from '@nestjs/common';
import { AddGuestRevenueDto, AddSubscriperRevenueDto } from './revenue.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Revenue } from './revenue.model';
import { SubscriperRevenue } from './subscriper-revenue.model';
import { GuestRevenue } from './guest-revenue.model';

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
    


    async getRevenuesByDate(){
        // create it
    };
    
    async getRevenuesByUser(){
        // create it
    };


}
