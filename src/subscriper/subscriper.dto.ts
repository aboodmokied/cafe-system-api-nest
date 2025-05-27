import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

// تعريف نوع الاشتراك كـ enum
export enum SubscriptionType {
  MONTHLY = "monthly",
  WEEKLY = "weekly",
}

export class CreateSubscriperDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(SubscriptionType, { message: "type must be either 'monthly' or 'weekly'" })
  @IsNotEmpty()
  type: SubscriptionType;
}
