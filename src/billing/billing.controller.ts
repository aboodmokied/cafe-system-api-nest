import { Body, Controller, Post, Res } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Response } from 'express';
import { BillingPaymentDto } from './billing.dto';

@Controller('billing')
export class BillingController {
    constructor(private billingService:BillingService){}

    @Post('payment')
    async billingPayment(@Res() res:Response,@Body() billingPaymentDto:BillingPaymentDto){
        const billing=await this.billingService.billingPayment(billingPaymentDto);
        return res.send({billing});
    }
}
