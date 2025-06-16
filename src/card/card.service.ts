import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from './card.model';
import { AddToStockDto, CreateCardDto, RemoveFromStockDto } from './card.dto';
import { SupplierBillingService } from 'src/supplier-billing/supplier-billing.service';
import { ExpensesService } from 'src/expenses/expenses.service';
import { PointBillingService } from 'src/point-billing/point-billing.service';
import { RevenueService } from 'src/revenue/revenue.service';

@Injectable()
export class CardService {
    constructor(
        @InjectModel(Card) private cardModel:typeof Card,
        private supplierBillingService:SupplierBillingService,
        private pointBillingService:PointBillingService,
        private revenueService:RevenueService,
        private expensesService:ExpensesService,
    ){}
    
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
                await card.update({qty:--card.qty});
                return card;
            }else{
                throw new BadRequestException(['لا يوجد بطاقات في المخزون']);
            }
        }
        return null;
    }

    async returnCard(cardId:number){
        const card=await this.cardModel.findByPk(cardId);
        if(card){
            await card.update({qty:++card.qty});
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
        // create supplier billing 
        const billing=await this.supplierBillingService.createSupplierBilling({
            cardId,
            cardsCount:qty,
            supplierId,
            totalAmount:totalPrice,
            paidAmount:paidPrice??0,
            isPaid:totalPrice==paidPrice
        });
        // create expenses transaction
        if(paidPrice>0){
            await this.expensesService.addSupplierExpenses({
                type:'SUPPLIER',
                amount:paidPrice,
                date:new Date(),
                supplierBillingId:billing.id,
                supplierId:billing.supplierId
            })
        }
        const updatedCard=await card.update({qty:card.qty+addToStockDto.qty});
        return updatedCard;
    }

    async removeFromStock(removeFromStockDto:RemoveFromStockDto){
        const card=await this.cardModel.findByPk(removeFromStockDto.cardId);
        if(!card){
            throw new NotFoundException('Card Not Found')
        }
        const {cardId,paidPrice,qty,pointId,totalPrice}=removeFromStockDto;
        if(qty>card.qty){
            throw new BadRequestException(['عدد البطاقات في المخزون غير كافي']);
        }
        // create point billing 
        const billing=await this.pointBillingService.createPointBilling({
            cardId,
            cardsCount:qty,
            pointId,
            totalAmount:totalPrice,
            paidAmount:paidPrice??0,
            isPaid:totalPrice==paidPrice
        });
        // create revenue transaction
        if(paidPrice>0){
            await this.revenueService.addPointRevenue({
                type:'POINT',
                amount:paidPrice,
                date:new Date(),
                pointBillingId:billing.id,
                pointId:billing.pointId
            })
        }
        const updatedCard=await card.update({qty:card.qty-removeFromStockDto.qty});
        return updatedCard;
    }


}
