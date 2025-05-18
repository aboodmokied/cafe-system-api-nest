import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { OrderService } from './order.service';
import { AddCardOrderDto, AddChargingOrderDto, AddOtherOrderDto, GetOrdersDto } from './order.dto';
import { OrderTypes } from 'src/types';
import { Response } from 'express';

@Controller('order')
export class OrderController {
    constructor(private orderService:OrderService){}

    @Get(':sessionId')
    async getOders(@Res() res,@Param() getOrdersDto:GetOrdersDto){
        const orders=await this.orderService.getOrders(getOrdersDto);
        return res.send({orders});
    }

    @Post()
    async addOrder(@Res() res:Response,@Body() addOrderDto:AddCardOrderDto|AddChargingOrderDto|AddOtherOrderDto){
        const {type}=addOrderDto;
        let order;
        if(type==OrderTypes.card){
            order=await this.orderService.addCardOrder(addOrderDto);
        }else if(type==OrderTypes.charging){
            order=await this.orderService.addChargingOrder(addOrderDto);
        }else if(type==OrderTypes.other){
            order=await this.orderService.addOtherOrder(addOrderDto);
        }else{
            throw new BadRequestException([`This order type ${type} not provided`]);
        }
        return res.status(201).send({order});
    }
}
