import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CardImportService } from './card-import.service';

@UseGuards(JwtAuthGuard)
@Controller('card-import')
export class CardImportController {
    constructor(private cardImportService:CardImportService){}
}
