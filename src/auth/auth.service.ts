import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './token.model';


@Injectable()
export class AuthService {
    constructor(@InjectModel(Token) private tokenModel,private jwtService:JwtService){}
    // async validateUser(email:string,password:string){
    //     const user=await this.userService.findByEmail(email);
    //     if(user && bcrypt.compareSync(password,user.password)){
    //         return user;
    //     }
    //     return null;
    // }
    // async generateJwtToken(user:User){
    //     const payload:AuthPayload={
    //         sub:user.id,
    //         name:user.name,
    //         roles:user.roles
    //     }
    //     const accessToken=this.jwtService.sign(payload);
    //     await this.tokenModel.create({
    //         token:accessToken,
    //         user:user.id
    //     })
    //     const {_id,name,email,roles}=user;
    //     return {accessToken,user:{_id,name,email,roles}};
    // }

    // async isValidTokenWithUser(token:string){
    //     const tokenRecord=await this.tokenModel.findOne({token,revoked:false});
    //     if(tokenRecord){
    //         try {
    //             const payload:AuthPayload=this.jwtService.verify(tokenRecord.token);
    //             const user=await this.userService.getById(payload.sub);
    //             if(user){
    //                 return user;
    //             }
    //         } catch (error) {
    //             throw new UnauthorizedException(error.message||'Unauthorized')
    //         }
    //     }
    //     return null;
    // }

    // logout(token:string){
    //     return this.tokenModel.updateMany({token},{revoked:true});
    // }
}
