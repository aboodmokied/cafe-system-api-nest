import { Controller, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private userService:UserService){}

    @Post('seed')
        login(@Req() req:Request){
            const {email,name,password}=req.body;
            return this.userService.registerUser({email,password,name});    
        }
}
