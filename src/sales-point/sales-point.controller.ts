import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { SalesPointService } from './sales-point.service';
import { Response } from 'express';
import { CreateSalesPointDto } from './sales-point.dto';

@Controller('sales-point')
export class SalesPointController {
    
    constructor(private salesPointService:SalesPointService){}

    @Get()
    async getSalesPoints(@Res() res:Response){
        const suppliers=await this.salesPointService.getSalesPoints();
        return res.send({suppliers});
    }

    @Get(':id/report')
    async getSalesPointReport(@Res() res:Response,@Param('id',ParseIntPipe) id:number){
        const salesPoint= await this.salesPointService.getSalesPointReport(id);
        if(!salesPoint){
            throw new NotFoundException('salesPoint not found');
        }
        return res.send({salesPoint});
    }

    @Post()
    async addSalesPoint(@Res() res:Response,@Body() createSalesPointDto:CreateSalesPointDto){
        const salesPoint=await this.salesPointService.createSalesPoint(createSalesPointDto);
        return res.status(201).send({salesPoint});
    }
}
