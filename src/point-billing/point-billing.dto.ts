import { IsNotEmpty, IsNumber } from "class-validator";

export class CreatePointBillingDto{
    pointId:number;
    totalAmount: number;
    cardsCount: number;
    cardId: number;
    paidAmount?: number;
    isPaid?: boolean;
}



export class PointBillingPaymentDto{
    @IsNotEmpty()
    @IsNumber()
    pointBillingId:number;

    @IsNotEmpty()
    @IsNumber()
    amount:number
}