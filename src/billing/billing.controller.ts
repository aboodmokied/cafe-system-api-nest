import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Response } from 'express';
import { BillingPaymentDto } from './billing.dto';

@Controller('billing')
export class BillingController {
    constructor(private billingService:BillingService){}

    @Get('collection')
    async getExpenses(
        @Res() res:Response,
        @Query('page') page: string,
        @Query('limit') limit: string,
    ){
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const result=await this.billingService.getCollectionBillings(pageNumber,limitNumber)
        return res.send(result);
    }


    @Post('payment')
    async billingPayment(@Res() res:Response,@Body() billingPaymentDto:BillingPaymentDto){
        const billing=await this.billingService.billingPayment(billingPaymentDto);
        return res.send({billing});
    }
}
