import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SalesPoint } from './sales-point.model';
import { literal } from 'sequelize';
import { CreateSalesPointDto } from './sales-point.dto';
import { PointBilling } from 'src/point-billing/point-billing.model';
import { Card } from 'src/card/card.model';
import { getPaginationOptions } from 'src/utils/pagination-options';

@Injectable()
export class SalesPointService {

    constructor(
        @InjectModel(SalesPoint) private salesPointModel:typeof SalesPoint
    ){}

        async getSalesPoints(page=1,limit=10){
            const {data:salesPoints,pagination}=await this.salesPointModel.findWithPagination(page,limit,{
                order: [['createdAt', 'DESC']]
            })
            return {salesPoints,pagination};
        }
    
        async getSalesPointReport(salesPointId:number,page=1,limit=10){
            const paginationOptions=getPaginationOptions(page,limit);
            const salesPoint=await this.salesPointModel.findOne({
                where: { id:salesPointId },
                include: [
                {
                    model: PointBilling,
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
                            FROM point_billings
                            WHERE point_billings.pointId = SalesPoint.id AND point_billings.isPaid = false
                        )`),
                        'pointTotalAmount',
                    ],
                ],
                },
                raw: false,
                subQuery: false,
            });
            if(!salesPoint){
                throw new NotFoundException('sales point not found');
            }
            const pointBillingsCount=await salesPoint.getBillingsCount();
            const totalPages = Math.ceil(pointBillingsCount / limit);
            return {
                salesPoint,
                pagination:{
                    page,
                    limit,
                    totalPages
                }
                
            }
        }
    
        async createSalesPoint(createSalesPointDto:CreateSalesPointDto){
            const count=await this.salesPointModel.count({where:{name:createSalesPointDto.name}});
            if(count){
                throw new BadRequestException([`هذه النقطة موجودة بالفعل: ${createSalesPointDto.name}`]);
            }
            return this.salesPointModel.create({...createSalesPointDto});
        }
}
