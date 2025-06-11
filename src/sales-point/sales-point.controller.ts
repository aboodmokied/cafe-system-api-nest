import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Query, Res } from '@nestjs/common';
import { SalesPointService } from './sales-point.service';
import { Response } from 'express';
import { CreateSalesPointDto } from './sales-point.dto';

@Controller('sales-point')
export class SalesPointController {
    
    constructor(private salesPointService:SalesPointService){}

    @Get()
    async getSalesPoints(
        @Res() res:Response,
        @Query('page') page: string,
        @Query('limit') limit: string
    ){
        const {salesPoints,pagination}=await this.salesPointService.getSalesPoints(+page,+limit);
        return res.send({salesPoints,pagination});
    }

    @Get(':id/report')
    async getSalesPointReport(
        @Res() res:Response,
        @Param('id',ParseIntPipe) id:number,
        @Query('page') page: string,
        @Query('limit') limit: string
    ){
        const {salesPoint,pagination}= await this.salesPointService.getSalesPointReport(id,+page,+limit);
        if(!salesPoint){
            throw new NotFoundException('salesPoint not found');
        }
        return res.send({salesPoint,pagination});
    }

    @Post()
    async addSalesPoint(@Res() res:Response,@Body() createSalesPointDto:CreateSalesPointDto){
        const salesPoint=await this.salesPointService.createSalesPoint(createSalesPointDto);
        return res.status(201).send({salesPoint});
    }
}
