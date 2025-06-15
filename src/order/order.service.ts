import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.model';
import { AddCardOrderDto, AddChargingOrderDto, AddOtherOrderDto, GetOrdersDto, StopChargingOrderDto } from './order.dto';
import { CardOrder } from './card-order.model';
import { ChargingOrder } from './charging-order.model';
import { OtherOrder } from './other-order.model';
import { CardService } from 'src/card/card.service';
import { BillingService } from 'src/billing/billing.service';
import { SessionService } from 'src/session/session.service';
import { Op } from 'sequelize';

// function getSubOrder(order) {
//   return order.CardOrder || order.ChargingOrder || order.OtherOrder;
// }


@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order) private orderModel:typeof Order,
        @InjectModel(CardOrder) private cardOrderModel:typeof CardOrder,
        @InjectModel(ChargingOrder) private chargingOrderMode:typeof ChargingOrder,
        @InjectModel(OtherOrder) private otherOrderMode:typeof OtherOrder,
        private cardService:CardService,
        private billingService:BillingService,
        private sessionService:SessionService
    ){}

    private async updateBillngIfExist(sessionId:number,amount:number,action:"INC"|"DEC") {
        const billingId=await this.sessionService.getSessionBillingId(sessionId);
        if(billingId){
            await this.billingService.updateBillingTotalAmount(billingId,amount,action);
        }
    }

    async getOrders(getOrdersDto:GetOrdersDto){
        const orders = await this.orderModel.findAll({
            where:{sessionId:getOrdersDto.sessionId},
            include: [
                { model: this.cardOrderModel, required: false },
                { model: this.chargingOrderMode, required: false },
                { model: this.otherOrderMode, required: false },
            ],
        });
        return orders;
    };
    async addCardOrder(addOrderDto:AddCardOrderDto){
        const {cardId,sessionId,type}=addOrderDto;
        const card=await this.cardService.giveMeCard(cardId);
        if(!card){
            throw new NotFoundException('Card Not Found')    
        }
        const order=await this.orderModel.create({sessionId,type,price:card.price});
        const cardOrder=await this.cardOrderModel.create({id:order.id,cardId:card.id});
        order.cardOrder=cardOrder;
        // update billing price
        this.updateBillngIfExist(sessionId,order.price,'INC');
        return order;
    };
    async addChargingOrder(addOrderDto:AddChargingOrderDto){
        const {sessionId,type}=addOrderDto;
        const order=await this.orderModel.create({sessionId,type});
        const chargingOrder=await this.chargingOrderMode.create({id:order.id});
        order.chargingOrder=chargingOrder;
        return order;
    };
    async stopChargingOrder(stopChargingOrderDto:StopChargingOrderDto){
        console.log({stopChargingOrderDto});
        const {orderId,price,endAt}=stopChargingOrderDto;
        const order=await this.orderModel.findByPk(orderId);
        if(!order){
            throw new NotFoundException('order not found');
        }
        await order.update({price});
        await this.chargingOrderMode.update({endAt},{where:{id:orderId}});
        // update billing
        this.updateBillngIfExist(order.sessionId,order.price,'INC');
        return order;
    };
    async addOtherOrder(addOrderDto:AddOtherOrderDto){
        const {price,sessionId,title,type}=addOrderDto;
        const order=await this.orderModel.create({sessionId,type,price});
        const otherOrder=await this.otherOrderMode.create({id:order.id,title});
        order.otherOrder=otherOrder;
        // update billing
        this.updateBillngIfExist(sessionId,order.price,'INC');
        return order;
    };

    async sessionHasActiveChargingOrder(sessionId:number){
        return this.orderModel.findOne({
            where:{
                sessionId,
                type:'CHARGING'
            },
            include:[
                {
                    model:ChargingOrder,
                    where:{endAt:{[Op.ne]:null}},
                    required:true
                }
            ]
        });
    };
    async removeOrder(){};
    async updateOrder(){};
}
