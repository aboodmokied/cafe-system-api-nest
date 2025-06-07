import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// @UseGuards(JwtAuthGuard) // 🔒 applies to ALL routes in this controller
@Controller('user')
export class UserController {
    constructor(private userService:UserService){}
    @Post('seed')
        login(@Req() req:Request){
            const {email,name,password}=req.body;
            return this.userService.registerUser({email,password,name});    
        }
}
