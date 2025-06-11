import { Controller, Get, Query, Res } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { Response } from 'express';

@Controller('revenue')
export class RevenueController {
    constructor(private revenueService:RevenueService){}

    @Get()
    async getRevenues(
        @Res() res:Response,
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ){
        const now = new Date();

        // بداية الشهر الحالي عند 00:00
        const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const defaultEnd = new Date();
        
        const parsedStartDate = startDate ? new Date(startDate) : defaultStart;

        let parsedEndDate = endDate ? new Date(endDate) : defaultEnd;
        
        const {revenues,totalAmount,pagination}=await this.revenueService.getRevenuesByDate({startDate:parsedStartDate,endDate:parsedEndDate,page:+page,limit:+limit});

        return res.send({
            revenues,
            totalAmount,
            startDate:parsedStartDate.toISOString(),
            endDate:parsedEndDate.toISOString(),
            pagination
        })
    }    
}
