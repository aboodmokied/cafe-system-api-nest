import { BadRequestException, Injectable } from '@nestjs/common';
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
        return this.subscriperModel.findOne({
            where: { id:subscriberId },
            include: [
            {
                model: Billing,
                order: [['startDate', 'DESC']],
                include: [
                {
                    model: Session,
                    include: [
                    {
                        model: Order,
                        attributes: [],
                    },
                    ],
                    // attributes: ['id'],
                },
                ],
                attributes: {
                    include: [
                        [
                        literal(`(
                            SELECT COALESCE(SUM(orders.price), 0)
                            FROM sessions
                            JOIN orders ON orders.sessionId = sessions.id
                            WHERE sessions.billingId = billings.id
                        )`),
                        'totalPrice'
                        ]
                    ]
                },
            },
            ],
            attributes: {
            include: [
                [
                    literal(`(
                        SELECT COALESCE(SUM(orders.price), 0)
                        FROM billings
                        JOIN sessions ON sessions.billingId = billings.id
                        JOIN orders ON orders.sessionId = sessions.id
                        WHERE billings.subscriperId = Subscriper.id AND billings.isPaid = false
                    )`),
                    'totalPrice',
                ],
            ],
            },
            raw: false,
            subQuery: false,
        });
    }
}
