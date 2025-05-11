import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from 'passport-local';
import { AuthService } from "../auth.service";
import { UserService } from "src/user/user.service";
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,'local'){
    constructor(private readonly authService:AuthService, private readonly userService:UserService){
        super({
            usernameField:'email'
        })
    }
    async validate(email:string,password:string){
        const user=await this.userService.validateUser(email,password);
        if(!user){
            throw new UnauthorizedException('Invalid Credintials');
        }
        return user;
    }
}