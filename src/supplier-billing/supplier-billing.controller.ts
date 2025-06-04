import { Body, Controller, Post, Res } from '@nestjs/common';
import { SupplierBillingService } from './supplier-billing.service';
import { Response } from 'express';
import { SupplierBillingPaymentDto } from './supplier-billing.dto';

@Controller('supplier-billing')
export class SupplierBillingController {
    constructor(private supplierBillingService:SupplierBillingService){}

    @Post('payment')
    async billingPayment(@Res() res:Response,@Body() billingPaymentDto:SupplierBillingPaymentDto){
        const billing=await this.supplierBillingService.supplierBillingPayment(billingPaymentDto);
        return res.send({billing});
    }
}
