import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSessionDto{

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    clientType:string
    
    @IsNumber()
    subscriperId?: number;
 
}

export class CloseSessionDto{

    @IsNumber()
    @IsNotEmpty()
    id: string;

   

}