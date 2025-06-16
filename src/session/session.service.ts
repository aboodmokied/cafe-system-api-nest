import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Session } from './session.model';
import { CloseSessionDto, CreateSessionDto } from './session.dto';
import { BillingService } from 'src/billing/billing.service';
import { SubscriperService } from 'src/subscriper/subscriper.service';
import { RevenueService } from 'src/revenue/revenue.service';
import { col, fn, literal } from 'sequelize';
import { Order } from 'src/order/order.model';
import { OrderService } from 'src/order/order.service';
import { ChargingOrder } from 'src/order/charging-order.model';
import { Op } from 'sequelize';

@Injectable()
export class SessionService {
    constructor(
        @InjectModel(Session) private sessionModel:typeof Session,
        @InjectModel(Order) private orderModel:typeof Order,
        private billingService:BillingService,
        private subscriperService:SubscriperService,
        private revenueService:RevenueService,
        // private orderService:OrderService
    ){}

    async createSession({username,clientType}:CreateSessionDto){
        const count=await this.sessionModel.count({where:{isActive:true,username,clientType}});
        if(count){
            throw new BadRequestException(`هذا المستخدم لديه جلسة نشطة بالفعل`);
        }
        return this.sessionModel.create({username,clientType});
    }

    async createSubscriperSession(createSessionDto:CreateSessionDto){
        const {clientType,username,subscriperId}=createSessionDto;
        if(!subscriperId){
            throw new BadRequestException(['subscriperId required']);
        }
        const count=await this.sessionModel.count({where:{isActive:true,subscriperId,clientType}});
        if(count){
            throw new BadRequestException([`هذا المستخدم لديه جلسة نشطة بالفعل`]);
        }
        // get the subscriper
        const subscriper=await this.subscriperService.getSubscriperById(subscriperId);
        if(!subscriper){
            throw new NotFoundException('subscriper not found');
        }
        // get valid billing
        const validSubscriperBilling=await this.billingService.getLatestValidBillingByDay(subscriperId,subscriper.type);
        if(validSubscriperBilling?.isPaid){
            validSubscriperBilling.isPaid=false;
            await validSubscriperBilling.save();
        }
        // create session   
        const session=await this.sessionModel.create({
            clientType,
            username,
            subscriperId,
            billingId:validSubscriperBilling!.id
        });
        return session;
    }

    async closeSession({id}:CloseSessionDto){
        const session=await this.sessionModel.findByPk(id);
        if(!session){
            throw new BadRequestException('هذه الجلسة غير موجودة');
        }else if(!session.isActive){
            throw new BadRequestException('هذه الجلسة مغلقة بالفعل');
        }
        const activeOrder=await this.orderModel.findOne({
                    where:{
                        sessionId:session.id,
                        type:'CHARGING'
                    },
                    include:[
                        {
                            model:ChargingOrder,
                            where:{endAt:null},
                            required:true
                        }
                    ]
                });
        console.log({activeOrder});
        if(activeOrder){
            throw new BadRequestException(['الجلسة تحتوي طلب شحن مفتوح قم بإغلاقه كي تقوم بإنهاء الجلسة']);
        }
        if(session.clientType=='GUEST'){
            // get session total amount
            const result = await this.orderModel.findOne({
                where: { sessionId:id },
                attributes: [[literal('COALESCE(SUM(price), 0)'), 'total']],
                raw: true,
            });
            if(!result){
                throw new Error('problem when calcualting the total amount');
            }
            const amount=parseFloat((result as any).total);
            // record a revenue transaction
            if(amount>0){
                await this.revenueService.addGuestRevenue({
                    type:'GUEST',
                    amount,
                    sessionId:session.id,
                    username:session.username,
                    date:new Date(),
                })
            }
        }
        return session.update({isActive:false,endAt:Date.now()});
    }

    async getSessionBillingId(sessionId:number){
        const session=await this.sessionModel.findByPk(sessionId,{
            attributes:['billingId']
        })
        const {billingId}=session as any;
        return billingId;
    }

    async getSessions(page = 1, limit = 10,status='open'){
        let where:any={};
        if(status=='open'){
            where.isActive=true;
        }else if(status=='closed'){
            where.isActive=false;
        }
        return this.sessionModel.findWithPagination(page,limit,{
            where,
            order: [['createdAt', 'DESC']],
        });
    }

    async getSessionType(sessionId:number){
        const session=await this.sessionModel.findOne({
            where:{id:sessionId},
            attributes:['clientType']
        })
        if(!session){
            throw new NotFoundException('session not found');
        }
        return session.clientType;
    }
}
