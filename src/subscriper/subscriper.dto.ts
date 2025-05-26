import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriperDto{

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    phone:string
 
}

