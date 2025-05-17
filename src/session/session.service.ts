import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Session } from './session.model';
import { CloseSessionDto, CreateSessionDto } from './session.dto';

@Injectable()
export class SessionService {
    constructor(@InjectModel(Session) private sessionModel:typeof Session){}

    async createSession({username,clientType}:CreateSessionDto){
        const count=await this.sessionModel.count({where:{isActive:true,username,clientType}});
        if(count){
            throw new BadRequestException(`هذا المستخدم لديه جلسة نشطة بالفعل`);
        }
        return this.sessionModel.create({username,clientType});
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

    async getSessions(){
        return this.sessionModel.findAll();
    }
}
