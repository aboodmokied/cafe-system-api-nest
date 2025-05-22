import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { CardService } from './card.service';
import { Response } from 'express';
import { CreateCardDto } from './card.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard) 
@Controller('card')
export class CardController {
    constructor(private cardService:CardService){}
    
    
    @Get()
    async getCards(@Res() res:Response){
        const cards=await this.cardService.getCards();
        return res.send({cards});
    }

    @Post()
    async addCard(@Res() res:Response,@Body() createCardDto:CreateCardDto){
        const card=await this.cardService.createCard(createCardDto);
        return res.status(201).send({card});
    }
}
