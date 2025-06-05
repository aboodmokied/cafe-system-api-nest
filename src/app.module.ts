import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { OrderModule } from './order/order.module';
import { CardModule } from './card/card.module';
import { SupplierModule } from './supplier/supplier.module';
import { CardImportModule } from './card-import/card-import.module';
import { SubscriperModule } from './subscriper/subscriper.module';
import { BillingModule } from './billing/billing.module';
import { RevenueModule } from './revenue/revenue.module';
import { SupplierBillingModule } from './supplier-billing/supplier-billing.module';
import { ExpensesModule } from './expenses/expenses.module';
import { SalesPointModule } from './sales-point/sales-point.module';
import { PointBillingModule } from './point-billing/point-billing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available app-wide
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get<'postgres' | 'mysql' | 'sqlite'>('DB_DIALECT'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadModels: true,
        synchronize: true, // Set false in production
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    SessionModule,
    OrderModule,
    CardModule,
    SupplierModule,
    CardImportModule,
    SubscriperModule,
    BillingModule,
    RevenueModule,
    SupplierBillingModule,
    ExpensesModule,
    SalesPointModule,
    PointBillingModule,
  ],
})
export class AppModule {}
