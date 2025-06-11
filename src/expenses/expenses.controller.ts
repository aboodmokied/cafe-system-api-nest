import { Controller, Get, Query, Res } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Response } from 'express';

@Controller('expenses')
export class ExpensesController {
    constructor(private expensesService:ExpensesService){}

    @Get()
    async getExpenses(
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
        
        const {expenses,totalAmount,pagination}=await this.expensesService.getExpensesByDate({
            startDate:parsedStartDate,
            endDate:parsedEndDate,
            page:+page,
            limit:+limit
        });

        return res.send({
            expenses,
            totalAmount,
            startDate:parsedStartDate.toISOString(),
            endDate:parsedEndDate.toISOString(),
            pagination
        })
    }
}
