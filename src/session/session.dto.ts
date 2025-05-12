import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSessionDto{

    @IsString()
    @IsNotEmpty()
    username: string;

    // TODO: Add subscriber and others

}

export class CloseSessionDto{

    @IsNumber()
    @IsNotEmpty()
    id: string;

   

}