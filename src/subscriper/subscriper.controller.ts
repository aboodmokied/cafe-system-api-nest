import { BadRequestException, Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Query, Res, UseGuards } from '@nestjs/common';
import { SubscriperService } from './subscriper.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { CreateSubscriperDto } from './subscriper.dto';

// @UseGuards(JwtAuthGuard)
@Controller('subscriper')
export class SubscriperController {
    constructor(private subscriperService:SubscriperService){}

    @Get()
    async getSubscripers(
        @Res() res:Response,
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('q') q?: string
    ){
        const pageNumber=parseInt(page||"1");
        const limitNumber=parseInt(limit||"10");
        if(q&&q.length){
            const {subscripers,pagination}= await this.subscriperService.allSubscripersWithSearch(pageNumber,limitNumber,q);
            return res.send({subscripers,pagination});
        }else{
            const {subscripers,pagination}= await this.subscriperService.allSubscripers(pageNumber,limitNumber);
            return res.send({subscripers,pagination});
        }
    }

    @Get(':id/report')
    async getSubscriperReport(
        @Res() res:Response,
        @Param('id',ParseIntPipe) id:number,
        @Query('page') page: string,
        @Query('limit') limit: string
    ){
        const pageNumber=parseInt(page||"1");
        const limitNumber=parseInt(limit||"10");
        const {subscriper,pagination}= await this.subscriperService.getSubscriperReport(id,pageNumber,limitNumber);
        return res.send({subscriper,pagination});
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
