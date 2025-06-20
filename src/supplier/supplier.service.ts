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
    constructor(
        @InjectModel(Supplier) private supplierModel:typeof Supplier,
        @InjectModel(SupplierBilling) private supplierBillingModel:typeof SupplierBilling,
    ){}

    async getSuppliers(page=1,limit=10){
        const {data:suppliers,pagination}=await this.supplierModel.findWithPagination(page,limit,{
            order: [['createdAt', 'DESC']]
        });
        return {suppliers,pagination}
    }
    
    async getSuppliersWithSearch(page=1,limit=10,q:string){
        const {data:suppliers,pagination}=await this.supplierModel.findWithPaginationAndSearch(page,limit,{
            order: [['createdAt', 'DESC']]
        },q,['name','phone']);
        return {suppliers,pagination}
    }

    async getSupplierReport(supplierId:number,page=1,limit=10){
        const supplier = await this.supplierModel.findOne({
                where: { id: supplierId },
                attributes: {
                include: [
                [
                    literal(`(
                        SELECT COALESCE(SUM("supplier_billings"."totalAmount" - "supplier_billings"."paidAmount"), 0)
                        FROM "supplier_billings"
                        WHERE "supplier_billings"."supplierId" = "Supplier"."id" AND "supplier_billings"."isPaid" = false
                    )`),
                    'supplierTotalAmount',
                ],
            ],
                },
                raw: false,
            });
        
          if (!supplier) {
            throw new NotFoundException('supplier not found');
          }
        
          const {data:supplierBillings,pagination}=await this.supplierBillingModel.findWithPagination(page,limit,{
            where: { supplierId },
            include: [{ model: Card }],
            order: [['date', 'DESC']]
          });
          (supplier as any).dataValues.supplierBillings=supplierBillings;
            return{
                supplier,
                pagination
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
