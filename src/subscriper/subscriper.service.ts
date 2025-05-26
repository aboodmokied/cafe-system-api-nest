import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subscriper } from './subscriper.model';
import { CreateSubscriperDto } from './subscriper.dto';

@Injectable()
export class SubscriperService {
    constructor(@InjectModel(Subscriper) private subscriperMode:typeof Subscriper){}

    async addSubscriper(createSubscriperDto:CreateSubscriperDto){
        const {username}=createSubscriperDto;
        const count=await this.subscriperMode.count({where:{username}});
        if(count){
            throw new BadRequestException([`المشترك موجود بالفعل: ${username}`]);
        }
        return this.subscriperMode.create({...createSubscriperDto});
    }
}
