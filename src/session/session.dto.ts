import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSessionDto{

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    clientType:string
    
    @IsOptional()
    @IsNumber()
    subscriperId?: number;
 
}

export class CloseSessionDto{

    @IsNumber()
    @IsNotEmpty()
    id: string;

   

}