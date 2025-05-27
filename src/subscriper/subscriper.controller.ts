import { BadRequestException, Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { SubscriperService } from './subscriper.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { CreateSubscriperDto } from './subscriper.dto';

@UseGuards(JwtAuthGuard)
@Controller('subscriper')
export class SubscriperController {
    constructor(private subscriperService:SubscriperService){}

    @Get()
    async getSubscripers(@Res() res:Response){
        const subscripers= await this.subscriperService.allSubscripers();
        return res.send({subscripers});
    }
    
    @Get(':username')
    async getSubscriper(@Res() res:Response,@Param() {username}){
        const subscriper= await this.subscriperService.getSubscriperByUsername(username);
        if(!subscriper){
            throw new BadRequestException(['المشترك غير موجود']);
        }
        return res.send({subscriper});
    }

    @Post()
    async createSubscriper(@Res() res:Response,@Body() createSubscriperDto:CreateSubscriperDto){
        const subscriber=await this.subscriperService.addSubscriper(createSubscriperDto);
        return res.status(201).send({subscriber});
    }
}
