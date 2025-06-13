import { BadRequestException, Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { CloseSessionDto, CreateSessionDto } from './session.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@UseGuards(JwtAuthGuard) // 🔒 applies to ALL routes in this controller
@Controller('session')
export class SessionController {
    constructor(private sessionService:SessionService){}

    @Get()
    async getSessions(
        @Res() res:Response,
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('status') status: string,
    ){
        const pageNumber=parseInt(page||"1");
        const limitNumber=parseInt(limit||"10");
        const sessionsStatus=status||'open';
        const {data:sessions,pagination}=await this.sessionService.getSessions(pageNumber,limitNumber,status);
        return res.send({sessions,pagination});
    }

    @Post()
    async startSession(@Res() res:Response,@Body() createSessionDto:CreateSessionDto){
        const {clientType}=createSessionDto;
        let session;
        if(clientType=='GUEST'){
            session=await this.sessionService.createSession(createSessionDto);
        }else if(clientType=='SUBSCRIPER'){
            session=await this.sessionService.createSubscriperSession(createSessionDto);
        }else{
            throw new BadRequestException([`نوع المستخدم غير مدعوم: ${clientType}`]);
        }
        return res.status(201).send({session})
    }

    @Post('close')
    async closeSession(@Res() res:Response,@Body() closeSessionDto:CloseSessionDto){
        const session=await this.sessionService.closeSession(closeSessionDto);
        return res.status(200).send({session})
    }

}
