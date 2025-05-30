import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateBillingDto{

    subscriperId: number;

    type: 'weekly' | 'monthly';


}


export class BillingPaymentDto{
    @IsNotEmpty()
    @IsNumber()
    billingId:number;

    @IsNotEmpty()
    @IsNumber()
    amount:number
}