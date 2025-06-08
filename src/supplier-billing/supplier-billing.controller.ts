import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { SupplierBillingService } from './supplier-billing.service';
import { Response } from 'express';
import { SupplierBillingPaymentDto } from './supplier-billing.dto';

@Controller('supplier-billing')
export class SupplierBillingController {
    constructor(private supplierBillingService:SupplierBillingService){}
    @Get('collection')
        async getCollectionBillings(
            @Res() res:Response,
            @Query('page') page: string,
            @Query('limit') limit: string,
        ){
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 10;
            const result=await this.supplierBillingService.getCollectionBillings(pageNumber,limitNumber)
            return res.send(result);
    }
    @Post('payment')
    async billingPayment(@Res() res:Response,@Body() billingPaymentDto:SupplierBillingPaymentDto){
        const billing=await this.supplierBillingService.supplierBillingPayment(billingPaymentDto);
        return res.send({billing});
    }
}
