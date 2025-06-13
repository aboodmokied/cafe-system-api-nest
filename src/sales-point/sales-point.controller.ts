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
        @Query('page') page?: string,
        @Query('limit') limit?: string
    ){
        const pageNumber=parseInt(page||"1");
        const limitNumber=parseInt(limit||"10");
        const {salesPoints,pagination}=await this.salesPointService.getSalesPoints(pageNumber,limitNumber);
        return res.send({salesPoints,pagination});
    }

    @Get(':id/report')
    async getSalesPointReport(
        @Res() res:Response,
        @Param('id',ParseIntPipe) id:number,
        @Query('page') page: string,
        @Query('limit') limit: string
    ){
        const pageNumber=parseInt(page||"1");
        const limitNumber=parseInt(limit||"10");
        const {salesPoint,pagination}= await this.salesPointService.getSalesPointReport(id,pageNumber,limitNumber);
        return res.send({salesPoint,pagination});
    }

    @Post()
    async addSalesPoint(@Res() res:Response,@Body() createSalesPointDto:CreateSalesPointDto){
        const salesPoint=await this.salesPointService.createSalesPoint(createSalesPointDto);
        return res.status(201).send({salesPoint});
    }
}
