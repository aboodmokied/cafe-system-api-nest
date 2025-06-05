import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { PointBillingService } from './point-billing.service';
import { PointBillingPaymentDto } from './point-billing.dto';

@Controller('point-billing')
export class PointBillingController {
    constructor(
        private pointBillingService:PointBillingService
    ){}

    @Get('collection')
    async getCollectionBillings(
        @Res() res:Response,
        @Query('page') page: string,
        @Query('limit') limit: string,
    ){
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const result=await this.pointBillingService.getCollectionBillings(pageNumber,limitNumber)
        return res.send(result);
    }


    @Post('payment')
    async billingPayment(@Res() res:Response,@Body() billingPaymentDto:PointBillingPaymentDto){
        const billing=await this.pointBillingService.pointBillingPayment(billingPaymentDto);
        return res.send({billing});
    }
}
