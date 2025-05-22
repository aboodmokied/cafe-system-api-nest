import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCardDto{
    @IsString()
    @IsNotEmpty()
    label:string;

    @IsNumber()
    @IsNotEmpty()
    price:number;

    // @IsNumber()
    // qty?:number;

    @IsNumber()
    hours:number;

    @IsString()
    speed?:string;
}


export class AddToStockDto{
    @IsNumber()
    @IsNotEmpty()
    cardId:number;

    @IsNumber()
    @IsNotEmpty()
    supplierId:number;

    @IsNumber()
    @IsNotEmpty()
    qty:number;

    @IsNumber()
    @IsNotEmpty()
    totalPrice:number;

    @IsNumber()
    @IsNotEmpty()
    paidPrice: number;
}