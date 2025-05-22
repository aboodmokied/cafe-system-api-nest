import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCardDto{
    @IsString()
    @IsNotEmpty()
    label:string;

    @IsNumber()
    @IsNotEmpty()
    price:number;

    @IsNumber()
    qty?:number;

    @IsNumber()
    hours:number;

    @IsString()
    speed?:string;
}