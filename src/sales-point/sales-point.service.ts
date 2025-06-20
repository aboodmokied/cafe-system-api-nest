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
        @InjectModel(SalesPoint) private salesPointModel:typeof SalesPoint,
        @InjectModel(PointBilling) private PointBillingModel:typeof PointBilling,
    ){}

        async getSalesPoints(page=1,limit=10){
           const {data:salesPoints,pagination}=await this.salesPointModel.findWithPagination(page,limit,{
                order: [['createdAt', 'DESC']]
            })
            return {salesPoints,pagination};
        }

        async getSalesPointsWithSearch(page=1,limit=10,q:string){
            const {data:salesPoints,pagination}=await this.salesPointModel.findWithPaginationAndSearch(page,limit,{
                order: [['createdAt', 'DESC']]
            },q,['name','phone']);
            return {salesPoints,pagination}
        }
    
        async getSalesPointReport(pointId:number,page=1,limit=10){
            const salesPoint = await this.salesPointModel.findOne({
                    where: { id: pointId },
                    attributes: {
                    include: [
                        [
                            literal(`(
                                SELECT COALESCE(SUM("point_billings"."totalAmount" - "point_billings"."paidAmount"), 0)
                                FROM "point_billings"
                                WHERE "point_billings"."pointId" = "SalesPoint"."id" AND "point_billings"."isPaid" = false
                            )`),
                            'pointTotalAmount',
                        ],
                    ],
                    },
                    raw: false,
                });
            
                if(!salesPoint){
                    throw new NotFoundException('sales point not found');
                }
            
                const {data:pointBillings,pagination}=await this.PointBillingModel.findWithPagination(page,limit,{
                    where: { pointId },
                    include: [{ model: Card }],
                    order: [['date', 'DESC']]
                });
                (salesPoint as any).dataValues.pointBillings=pointBillings;
                
                return{
                    salesPoint,
                    pagination
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
