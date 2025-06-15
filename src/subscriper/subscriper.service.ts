import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subscriper } from './subscriper.model';
import { CreateSubscriperDto } from './subscriper.dto';
import { Billing } from 'src/billing/billing.model';
import { Session } from 'src/session/session.model';
import { Order } from 'src/order/order.model';
import { Sequelize, fn, col, literal } from 'sequelize';
import { getPaginationOptions } from 'src/utils/pagination-options';

@Injectable()
export class SubscriperService {
    constructor(@InjectModel(Subscriper) private subscriperModel:typeof Subscriper){}

    async allSubscripers(page = 1, limit = 10){
        const {data:subscripers,pagination}=await this.subscriperModel.findWithPagination(page,limit,{
            order: [['createdAt', 'DESC']]
        })
        return {subscripers,pagination}
    }

    async allSubscripersWithSearch(page = 1, limit = 10,q:string){
        const {data:subscripers,pagination}=await this.subscriperModel.findWithPaginationAndSearch(page,limit,{
            order: [['createdAt', 'DESC']]
        },q,['username','phone','email']);
        return {subscripers,pagination}
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

    async getSubscriperReport(subscriberId:number,page = 1, limit = 10){
        const paginationOptions=getPaginationOptions(page,limit);
        const subscriper=await this.subscriperModel.findOne({
            where: { id:subscriberId },
            include: [
            {
                model: Billing,
                ...paginationOptions,
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
        if(!subscriper){
            throw new NotFoundException('subscriper not found');
        }
        const subscriperBillingsCount=await subscriper.getBillingsCount();
        const totalPages = Math.ceil(subscriperBillingsCount / limit);

        return{
            subscriper,
            pagination:{
                page,
                limit,
                totalPages
            }
            
        }
    }
}


// 0595786381 
// محمد جلال البكري