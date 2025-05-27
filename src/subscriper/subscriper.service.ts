import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subscriper } from './subscriper.model';
import { CreateSubscriperDto } from './subscriper.dto';

@Injectable()
export class SubscriperService {
    constructor(@InjectModel(Subscriper) private subscriperModel:typeof Subscriper){}

    async allSubscripers(){
        return this.subscriperModel.findAll();
    }

    async getSubscriperById(subscriperId:number){
        return this.subscriperModel.findByPk(subscriperId);
    }

    async getSubscriperByUsername(username:string){
        return this.subscriperModel.findOne({where:{username}});
    }

    async addSubscriper(createSubscriperDto:CreateSubscriperDto){
        const {username}=createSubscriperDto;
        const count=await this.subscriperModel.count({where:{username}});
        if(count){
            throw new BadRequestException([`المشترك موجود بالفعل: ${username}`]);
        }
        return this.subscriperModel.create({...createSubscriperDto});
    }
}
