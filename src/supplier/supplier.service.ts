import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Supplier } from './supplier.model';
import { CreateSupplierDto } from './supplier.dto';
import { SupplierBilling } from 'src/supplier-billing/supplier-billing.model';
import { Card } from 'src/card/card.model';
import { literal } from 'sequelize';
import { getPaginationOptions } from 'src/utils/pagination-options';

@Injectable()
export class SupplierService {
    constructor(@InjectModel(Supplier) private supplierModel:typeof Supplier){}

    async getSuppliers(page=1,limit=10){
        const {data:suppliers,pagination}=await this.supplierModel.findWithPagination(page,limit,{
            order: [['createdAt', 'DESC']]
        });
        return {suppliers,pagination}
    }

    async getSubscriperReport(supplierId:number,page=1,limit=10){
        const paginationOptions=getPaginationOptions(page,limit);
        
        const supplier= await this.supplierModel.findOne({
            where: { id:supplierId },
            include: [
            {
                model: SupplierBilling,
                ...paginationOptions,
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
        if(!supplier){
            throw new NotFoundException('supplier not found');
        }
        const supplierBillingsCount=await supplier.getBillingsCount();
        const totalPages = Math.ceil(supplierBillingsCount / limit);
        return {
            supplier,
            pagination:{
                page,
                limit,
                totalPages
            }
            
        }
    }

    async createSupplier(createSupplierDto:CreateSupplierDto){
        const count=await this.supplierModel.count({where:{name:createSupplierDto.name}});
        if(count){
            throw new BadRequestException([`هذه الشركة موجودة بالفعل: ${createSupplierDto.name}`]);
        }
        return this.supplierModel.create({...createSupplierDto});
    }
}
