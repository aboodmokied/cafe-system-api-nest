import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subscriper } from './subscriper.model';
import { CreateSubscriperDto } from './subscriper.dto';

@Injectable()
export class SubscriperService {
    constructor(@InjectModel(Subscriper) private subscriperMode:typeof Subscriper){}

    async addSubscriper(createSubscriperDto:CreateSubscriperDto){
        const {name}=createSubscriperDto;
        const count=await this.subscriperMode.count({where:{name}});
        if(count){
            throw new BadRequestException([`المشترك موجود بالفعل: ${name}`]);
        }
        return this.subscriperMode.create({...createSubscriperDto});
    }
}
