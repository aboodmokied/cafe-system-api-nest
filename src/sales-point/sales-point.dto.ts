import { IsNotEmpty, IsString } from "class-validator";

export class CreateSalesPointDto{
    @IsString()
    @IsNotEmpty()
    name:string;

    @IsString()
    @IsNotEmpty()
    phone:string;
};