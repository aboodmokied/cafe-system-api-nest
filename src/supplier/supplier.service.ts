import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Supplier } from './supplier.model';
import { CreateSupplierDto } from './supplier.dto';
import { SupplierBilling } from 'src/supplier-billing/supplier-billing.model';
import { Card } from 'src/card/card.model';
import { literal } from 'sequelize';

@Injectable()
export class SupplierService {
    constructor(@InjectModel(Supplier) private supplierModel:typeof Supplier){}

    async getSuppliers(){
        const suppliers=await this.supplierModel.findAll();
        return suppliers;
    }

    async getSubscriperReport(supplierId:number){
        const supplier=await this.supplierModel.findByPk(supplierId,{
            include:[]
        });
        if(!supplier){
            throw new NotFoundException('supplier not found');
        }
        return this.supplierModel.findOne({
            where: { id:supplierId },
            include: [
            {
                model: SupplierBilling,
                order: [['date', 'DESC']],
                include: [
                {
                    model: Card,
                    required:true
                },
                ],
            },
            ],
            attributes: {
            include: [
                [
                    literal(`(
                        SELECT COALESCE(SUM(totalAmount - paidAmount), 0)
                        FROM supplier_billings
                        WHERE supplier_billings.supplierId = Supplier.id AND supplier_billings.isPaid = false
                    )`),
                    'supplierTotalAmount',
                ],
            ],
            },
            raw: false,
            subQuery: false,
        });
    }

    async createSupplier(createSupplierDto:CreateSupplierDto){
        const count=await this.supplierModel.count({where:{name:createSupplierDto.name}});
        if(count){
            throw new BadRequestException([`هذه الشركة موجودة بالفعل: ${createSupplierDto.name}`]);
        }
        return this.supplierModel.create({...createSupplierDto});
    }
}
