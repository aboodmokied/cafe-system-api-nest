import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CardImport } from './card-import.model';
import { CreateCardImportDto } from './card-import.dto';

@Injectable()
export class CardImportService {
    constructor(@InjectModel(CardImport) private cardImportModel:typeof CardImport){}

    async addImport(createCardImportDto:CreateCardImportDto){
        return this.cardImportModel.create({...createCardImportDto});
    }
}
