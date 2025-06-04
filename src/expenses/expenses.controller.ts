import { Controller, Get, Query, Res } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Response } from 'express';

@Controller('expenses')
export class ExpensesController {
    constructor(private expensesService:ExpensesService){}

    @Get()
    async getRevenues(
        @Res() res:Response,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ){
        const now = new Date();

        // بداية الشهر الحالي عند 00:00
        const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const defaultEnd = new Date();
        
        const parsedStartDate = startDate ? new Date(startDate) : defaultStart;

        let parsedEndDate = endDate ? new Date(endDate) : defaultEnd;
        
        const {expenses,totalAmount}=await this.expensesService.getExpensesByDate(parsedStartDate,parsedEndDate);

        return res.send({
            expenses,
            totalAmount,
            startDate:parsedStartDate.toISOString(),
            endDate:parsedEndDate.toISOString(),
        })
    }
}
