import { Test, TestingModule } from '@nestjs/testing';
import { CardImportService } from './card-import.service';

describe('CardImportService', () => {
  let service: CardImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardImportService],
    }).compile();

    service = module.get<CardImportService>(CardImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
