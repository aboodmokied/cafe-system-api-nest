import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './token.model';
import { User } from 'src/user/user.model';
import { AuthPayload } from 'src/types';
import { randomUUID } from 'crypto';


@Injectable()
export class AuthService {
    constructor(@InjectModel(Token) private tokenModel:typeof Token,private jwtService:JwtService){}
    async isValidTokenWithUser(token:string){
        try {
            const signature=token?.split('.')[2];
            if(signature){
                const tokenObj=await this.tokenModel.findOne({
                    where:{signature,revoked:false},
                    include:{model:User,attributes:['id','name','email']}
                });
                const {sub,email}=this.jwtService.decode<AuthPayload>(token);
                if(tokenObj && tokenObj.user){
                    if(sub==tokenObj.user.id&&email==tokenObj.user.email)
                    return tokenObj.user;
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    }
    // async validateUser(email:string,password:string){
    //     const user=await this.userService.findByEmail(email);
    //     if(user && bcrypt.compareSync(password,user.password)){
    //         return user;
    //     }
    //     return null;
    // }
    async generateJwtToken(user:User){
        const payload:AuthPayload={
            sub:user.id,
            email:user.email,
            jti:randomUUID(), // unique identifier
        }
        const accessToken=this.jwtService.sign(payload);
        const signature=accessToken.split('.')[2];
        await this.tokenModel.create({
            signature,
            userId:user.id
        })
        const {id,name,email}=user;
        return {accessToken,user:{id,name,email}};
    }

    async logout(token:string){
        const signature=token.split('.')[2];
        return this.tokenModel.update({revoked:true},{where:{signature}});
    }
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
