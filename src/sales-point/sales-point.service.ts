import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SalesPoint } from './sales-point.model';
import { literal } from 'sequelize';
import { CreateSalesPointDto } from './sales-point.dto';

@Injectable()
export class SalesPointService {

    constructor(
        @InjectModel(SalesPoint) private salesPointModel:typeof SalesPoint
    ){}

        async getSalesPoints(){
            const salesPoints=await this.salesPointModel.findAll();
            return salesPoints;
        }
    
        // TODO
        async getSalesPointReport(salesPointId:number){
            const salesPoint=await this.salesPointModel.findByPk(salesPointId,{
                include:[]
            });
            if(!salesPoint){
                throw new NotFoundException('supplier not found');
            }
            return this.salesPointModel.findOne({
                where: { id:salesPointId },
                // include: [
                // {
                //     model: SalesPointBilling,
                //     order: [['date', 'DESC']],
                //     include: [
                //     {
                //         model: Card,
                //         required:true
                //     },
                //     ],
                // },
                // ],
            //     attributes: {
            //     include: [
            //         [
            //             literal(`(
            //                 SELECT COALESCE(SUM(totalAmount - paidAmount), 0)
            //                 FROM supplier_billings
            //                 WHERE supplier_billings.supplierId = Supplier.id AND supplier_billings.isPaid = false
            //             )`),
            //             'supplierTotalAmount',
            //         ],
            //     ],
            //     },
            //     raw: false,
            //     subQuery: false,
            });
        }
    
        async createSalesPoint(createSalesPointDto:CreateSalesPointDto){
            const count=await this.salesPointModel.count({where:{name:createSalesPointDto.name}});
            if(count){
                throw new BadRequestException([`هذه النقطة موجودة بالفعل: ${createSalesPointDto.name}`]);
            }
            return this.salesPointModel.create({...createSalesPointDto});
        }
}
