import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from './card.model';
import { AddToStockDto, CreateCardDto } from './card.dto';
import { CardImportService } from 'src/card-import/card-import.service';

@Injectable()
export class CardService {
    constructor(@InjectModel(Card) private cardModel:typeof Card,private cardImportService:CardImportService){}
    
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

    async addToStock(addToStockDto:AddToStockDto){
        const card=await this.cardModel.findByPk(addToStockDto.cardId);
        if(!card){
            throw new NotFoundException('Card Not Found')
        }
        const {cardId,paidPrice,qty,supplierId,totalPrice}=addToStockDto;
        await this.cardImportService.addImport({
            cardId,
            paidPrice,
            qty,
            supplierId,
            totalPrice,
            qtyBeforeImport:card.qty
        });
        const updatedCard=await card.update({qty:card.qty+addToStockDto.qty});
        return updatedCard;
    }
}
