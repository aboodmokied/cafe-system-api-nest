import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Session } from './session.model';
import { CloseSessionDto, CreateSessionDto } from './session.dto';
import { BillingService } from 'src/billing/billing.service';
import { SubscriperService } from 'src/subscriper/subscriper.service';

@Injectable()
export class SessionService {
    constructor(
        @InjectModel(Session) private sessionModel:typeof Session,
        private billingService:BillingService,
        private subscriperService:SubscriperService
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
        return session.update({isActive:false,endAt:Date.now()});
    }

    async getSessionBillingId(sessionId:number){
        const session=await this.sessionModel.findByPk(sessionId,{
            attributes:['billingId']
        })
        const {billingId}=session as any;
        return billingId;
    }

    async getSessions(){
        return this.sessionModel.findAll();
    }
}
