import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from 'passport-local';
import { UserService } from "src/user/user.service";
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,'local'){
    constructor(private readonly userService:UserService){
        super({
            usernameField:'email'
        })
    }
    async validate(email:string,password:string){
        // const user=await this.userService.validateUser(email,password);
        // for testing only:
        const user=await this.userService.validateUser('abood@gmail.com','123456789');
            
        if(!user){
            throw new BadRequestException(['البيانات المدخلة غير صحيحة']);
        }
        return user;
    }
}
