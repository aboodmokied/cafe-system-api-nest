import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Supplier } from './supplier.model';
import { CreateSupplierDto } from './supplier.dto';

@Injectable()
export class SupplierService {
    constructor(@InjectModel(Supplier) private supplierModel:typeof Supplier){}

    async getSuppliers(){
        const suppliers=await this.supplierModel.findAll();
        return suppliers;
    }

    async createSupplier(createSupplierDto:CreateSupplierDto){
        const count=await this.supplierModel.count({where:{name:createSupplierDto.name}});
        if(count){
            throw new BadRequestException([`هذه الشركة موجودة بالفعل: ${createSupplierDto.name}`]);
        }
        return this.supplierModel.create({...createSupplierDto});
    }
}
