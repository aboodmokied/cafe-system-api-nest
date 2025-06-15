import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Query, Res, UseGuards } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { Response } from 'express';
import { CreateSupplierDto } from './supplier.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('supplier')
export class SupplierController {
    constructor(private supplierService:SupplierService){}

    @Get()
    async getSuppliers(
        @Res() res:Response,
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('q') q?: string,
    ){
        const pageNumber=parseInt(page||"1");
        const limitNumber=parseInt(limit||"10");
        if(q&&q.length){
            const {suppliers,pagination}=await this.supplierService.getSuppliersWithSearch(pageNumber,limitNumber,q);
            return res.send({suppliers,pagination});
        }else{
            const {suppliers,pagination}=await this.supplierService.getSuppliers(pageNumber,limitNumber);
            return res.send({suppliers,pagination});
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
        const {supplier,pagination}= await this.supplierService.getSupplierReport(id,pageNumber,limitNumber);
        return res.send({supplier,pagination});
    }

    @Post()
    async addSuppliers(@Res() res:Response,@Body() createSupplierDto:CreateSupplierDto){
        const supplier=await this.supplierService.createSupplier(createSupplierDto);
        return res.status(201).send({supplier});
    }
}
