import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { SubscriperService } from './subscriper.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { CreateSubscriperDto } from './subscriper.dto';

@UseGuards(JwtAuthGuard)
@Controller('subscriper')
export class SubscriperController {
    constructor(private subscriperService:SubscriperService){}

    @Post()
    createSubscriper(@Res() res:Response,@Body() createSubscriperDto:CreateSubscriperDto){
        
    }
}
