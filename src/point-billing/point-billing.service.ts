import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PointBilling } from './point-billing.model';
import { RevenueService } from 'src/revenue/revenue.service';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePointBillingDto, PointBillingPaymentDto } from './point-billing.dto';
import { Op } from 'sequelize';
import { SalesPoint } from 'src/sales-point/sales-point.model';
import sequelize from 'sequelize';
import { Card } from 'src/card/card.model';

@Injectable()
export class PointBillingService {
    constructor(
        @InjectModel(PointBilling) private pointBillingModel:typeof PointBilling,
        private revenueService:RevenueService
    ){}

    async createPointBilling(createPointBiliingDto:CreatePointBillingDto){
        const pointBilling=await this.pointBillingModel.create({...createPointBiliingDto});
        return pointBilling;
    }

    async pointBillingPayment(pointBillingPaymentDto:PointBillingPaymentDto){
            const {pointBillingId,amount}=pointBillingPaymentDto;
            const billing=await this.pointBillingModel.findByPk(pointBillingId);
            if(!billing){
                throw new NotFoundException('billing not found');
            }
            // check if already paid
            if(billing.isPaid){
                throw new BadRequestException(['الفاتورة مسددة بالفعل']);
            }
            // check the amount over than the required amount
            const temp=billing.paidAmount+amount;
            if(temp>billing.totalAmount){
                throw new BadRequestException(['المبلغ المدخل اكبر من المبلغ المطلوب']);
            }else if(temp==billing.totalAmount){
                billing.isPaid=true;
            }
            // update paid amount
            billing.paidAmount=temp;
            billing.save();
    
           // record a revenue transaction
            await this.revenueService.addPointRevenue({
                type:'POINT',
                amount,
                pointBillingId,
                pointId:billing.pointId,
                date:new Date(),
            });

            return billing;
        }

        async getCollectionBillings(page = 1, limit = 10) {
          const {data:billings,pagination} = await this.pointBillingModel.findWithPagination(page,limit,{
            where: {
              isPaid: false,
            },
            include: [
              {
                model: SalesPoint,
                attributes: ['name'],
              },
              {
                model:Card
              }
            ],
            order: [['date', 'DESC']],
          });
        
          const totalAmountResult = await this.pointBillingModel.findOne({
            attributes: [[sequelize.literal('SUM(`totalAmount` - `paidAmount`)'), 'totalAmount']],
            where: {
              isPaid: false,
            },
            raw: true,
          });
        
          const totalAmount = totalAmountResult?.totalAmount ?? 0;
        
          return {
            billings,
            totalAmount,
            pagination
          };
        }
}
