import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from './card.model';
import { CreateCardDto } from './card.dto';

@Injectable()
export class CardService {
    constructor(@InjectModel(Card) private cardModel:typeof Card){}
    
    getCards(){
        return this.cardModel.findAll();
    }

    async createCard(createCardDto:CreateCardDto){
        const {label}=createCardDto;
        const count=await this.cardModel.count({where:{label}});
        if(count){
            throw new BadRequestException([`هذا النوع من البطاقات موجود مسبقاً: ${label}`])
        }
        return this.cardModel.create({...createCardDto});
    }

    async giveMeCard(cardId:number){
        const card=await this.cardModel.findByPk(cardId);
        if(card){
            if(card.qty>0){
                return await card.update({qty:--card.qty});
            }
            return card;
        }
        return null;
    }
}
