import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
// import { Roles } from "src/roles/roles.enum";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:'abood',
            ignoreExpiration:false
        })
    }
    validate(payload:{sub:string,name:string}){
        return {userId:payload.sub,name:payload.name}
    }
}