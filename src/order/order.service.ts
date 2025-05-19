import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.model';
import { AddCardOrderDto, AddChargingOrderDto, AddOtherOrderDto, GetOrdersDto, StopChargingOrderDto } from './order.dto';
import { CardOrder } from './card-order.model';
import { ChargingOrder } from './charging-order.model';
import { OtherOrder } from './other-order.model';

// function getSubOrder(order) {
//   return order.CardOrder || order.ChargingOrder || order.OtherOrder;
// }


@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order) private orderModel:typeof Order,
        @InjectModel(CardOrder) private cardOrderModel:typeof CardOrder,
        @InjectModel(ChargingOrder) private chargingOrderMode:typeof ChargingOrder,
        @InjectModel(OtherOrder) private otherOrderMode:typeof OtherOrder
    ){}
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
        // find the card (price)
        // create cardOrder (price,cardId)
        // create order (sessionId, type=CARD, cardOrder.id)
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
        await this.orderModel.update({price},{where:{id:orderId}});
        await this.chargingOrderMode.update({endAt},{where:{id:orderId}});
    };
    async addOtherOrder(addOrderDto:AddOtherOrderDto){
        const {price,sessionId,title,type}=addOrderDto;
        const order=await this.orderModel.create({sessionId,type,price});
        const otherOrder=await this.otherOrderMode.create({id:order.id,title});
        order.otherOrder=otherOrder;
        return order;
    };

    async removeOrder(){};
    async updateOrder(){};
}
