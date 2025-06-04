import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateSupplierBillingDto{
    supplierId:number;
    totalAmount: number;
    cardsCount: number;
    cardId: number;
    paidAmount?: number;
    isPaid?: boolean;
}



export class SupplierBillingPaymentDto{
    @IsNotEmpty()
    @IsNumber()
    supplierBillingId:number;

    @IsNotEmpty()
    @IsNumber()
    amount:number
}