import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { Response } from 'express';
import { CreateSupplierDto } from './supplier.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('supplier')
export class SupplierController {
    constructor(private supplierService:SupplierService){}

    @Get()
    async getSuppliers(@Res() res:Response){
        const suppliers=await this.supplierService.getSuppliers();
        return res.send({suppliers});
    }

    @Post()
    async addSuppliers(@Res() res:Response,@Body() createSupplierDto:CreateSupplierDto){
        const supplier=await this.supplierService.createSupplier(createSupplierDto);
        return res.status(201).send({supplier});
    }
}
