import { Body, Controller, Get, Post, Res } from '@nestjs/common';
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

    TODO
    // @Get(':id/report')
    // async getSubscriperReport(@Res() res:Response,@Param('id',ParseIntPipe) id:number){
    //     const supplier= await this.supplierService.getSubscriperReport(id);
    //     if(!supplier){
    //         throw new NotFoundException('supplier not found');
    //     }
    //     return res.send({supplier});
    // }

    @Post()
    async addSalesPoint(@Res() res:Response,@Body() createSalesPointDto:CreateSalesPointDto){
        const salesPoint=await this.salesPointService.createSalesPoint(createSalesPointDto);
        return res.status(201).send({salesPoint});
    }
}
