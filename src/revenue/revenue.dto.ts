import {
  IsEnum,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

class AddRevenueDto {
  @IsEnum(['GUEST', 'SUBSCRIPER', 'POINT'])
  type: 'GUEST' | 'SUBSCRIPER' | 'POINT';

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  userId?: number;
}

export class AddSubscriperRevenueDto extends AddRevenueDto {
  @IsDefined()
  @IsEnum(['SUBSCRIPER'])
  type: 'SUBSCRIPER';

  @IsDefined()
  @IsNumber()
  billingId: number;

  @IsDefined()
  @IsNumber()
  subscriperId: number;
}

export class AddGuestRevenueDto extends AddRevenueDto {
  @IsDefined()
  @IsEnum(['GUEST'])
  type: 'GUEST';

  @IsDefined()
  @IsString()
  username: string;

  @IsDefined()
  @IsNumber()
  sessionId: number;
}

export class AddPointRevenueDto extends AddRevenueDto {
  @IsDefined()
  @IsEnum(['POINT'])
  type: 'POINT';

  @IsDefined()
  @IsNumber()
  pointBillingId: number;

  @IsDefined()
  @IsNumber()
  pointId: number;
}
