import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subscriper } from './subscriper.model';
import { CreateSubscriperDto } from './subscriper.dto';
import { Billing } from 'src/billing/billing.model';
import { Session } from 'src/session/session.model';
import { Order } from 'src/order/order.model';
import { Sequelize, fn, col, literal } from 'sequelize';

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
        const {username,email}=createSubscriperDto;
        const countByName=await this.subscriperModel.count({where:{username}});
        if(countByName){
            throw new BadRequestException([`المشترك موجود بالفعل: ${username}`]);
        }
        const findByEmail=await this.subscriperModel.findOne({where:{email}});
        if(findByEmail){
            throw new BadRequestException([`الايميل مستخدم مسبقاً للمشترك: ${findByEmail.username}`]);
        }
        return this.subscriperModel.create({...createSubscriperDto});
    }

    async getSubscriperReport(subscriberId:number){
        const subscriper=await this.subscriperModel.findByPk(subscriberId,{
            include:[]
        });
        if(!subscriper){
            throw new NotFoundException('subscriper not found');
        }
        return this.subscriperModel.findOne({
            where: { id:subscriberId },
            include: [
            {
                model: Billing,
                order: [['startDate', 'DESC']],
                include: [
                {
                    model: Session,
                },
                ],
            },
            ],
            attributes: {
            include: [
                [
                    literal(`(
                        SELECT COALESCE(SUM(totalAmount - paidAmount), 0)
                        FROM billings
                        WHERE billings.subscriperId = Subscriper.id AND billings.isPaid = false
                    )`),
                    'subscriperTotalAmount',
                ],
            ],
            },
            raw: false,
            subQuery: false,
        });
    }
}
