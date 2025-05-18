import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { CloseSessionDto, CreateSessionDto } from './session.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@UseGuards(JwtAuthGuard) // 🔒 applies to ALL routes in this controller
@Controller('session')
export class SessionController {
    constructor(private sessionService:SessionService){}

    @Get()
    async getSessions(@Res() res:Response){
        const sessions=await this.sessionService.getSessions();
        return res.send({sessions});
    }

    @Post()
    async startSession(@Res() res:Response,@Body() createSessionDto:CreateSessionDto){
        const session=await this.sessionService.createSession(createSessionDto);
        return res.status(201).send({session})
    }

    @Post('close')
    async closeSession(@Res() res:Response,@Body() closeSessionDto:CloseSessionDto){
        const session=await this.sessionService.closeSession(closeSessionDto);
        return res.status(200).send({session})
    }

}
