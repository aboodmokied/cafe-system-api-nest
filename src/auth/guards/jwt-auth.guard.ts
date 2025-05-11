import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import { InjectModel } from "@nestjs/mongoose";
// import { AuthGuard } from "@nestjs/passport";
// import { Request } from "express";
// import { Model } from "mongoose";
// import { Observable } from "rxjs";
// import { AccessToken } from "src/schemas/AccessToken";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate{
    constructor(private authService:AuthService){}
    async canActivate(context: ExecutionContext){
        return true;
        // const ctx=context.switchToHttp();
        // const request:Request=ctx.getRequest<Request>();
        // const bearerToken=request.headers.authorization;
        // if(bearerToken&&bearerToken.startsWith('Bearer')){
        //     const token=bearerToken.split(' ')[1];
        //     if(token){
        //         // const authService=request.app.get(AuthService.name);
        //         const user=await this.authService.isValidTokenWithUser(token);
        //         if(user){
        //             request.user=user;
        //             return true;
        //         }
        //     }
        // }
        // throw new UnauthorizedException();
    }
    // async canActivate(context: ExecutionContext): Promise<boolean | Observable<boolean>> {
    //     const ctx=context.switchToHttp();
    //     const request:Request=ctx.getRequest<Request>();
    //     const bearerToken=request.headers.authorization;
    //     if(bearerToken&&bearerToken.startsWith('Bearer')){
    //         const token=bearerToken.split(' ')[1];
    //         if(token){
    //             const authService=request.app.get(AuthService.name);
    //             const user=await authService.isValidTokenWithUser(token);
    //             if(user){
    //                 request.user=user;
    //                 console.log({user});
    //                 return true;
    //             }
    //         }
    //     }
    //     throw new UnauthorizedException();
    // }
}