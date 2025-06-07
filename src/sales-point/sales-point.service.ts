import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SalesPoint } from './sales-point.model';
import { literal } from 'sequelize';
import { CreateSalesPointDto } from './sales-point.dto';
import { PointBilling } from 'src/point-billing/point-billing.model';
import { Card } from 'src/card/card.model';

@Injectable()
export class SalesPointService {

    constructor(
        @InjectModel(SalesPoint) private salesPointModel:typeof SalesPoint
    ){}

        async getSalesPoints(){
            const salesPoints=await this.salesPointModel.findAll();
            return salesPoints;
        }
    
        async getSalesPointReport(salesPointId:number){
            const salesPoint=await this.salesPointModel.findByPk(salesPointId,{
                include:[]
            });
            if(!salesPoint){
                throw new NotFoundException('sales point not found');
            }
            return this.salesPointModel.findOne({
                where: { id:salesPointId },
                include: [
                {
                    model: PointBilling,
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
        }
    
        async createSalesPoint(createSalesPointDto:CreateSalesPointDto){
            const count=await this.salesPointModel.count({where:{name:createSalesPointDto.name}});
            if(count){
                throw new BadRequestException([`هذه النقطة موجودة بالفعل: ${createSalesPointDto.name}`]);
            }
            return this.salesPointModel.create({...createSalesPointDto});
        }
}
