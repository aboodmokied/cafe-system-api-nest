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
import { User } from './user/user.model';
import { AutoUserSeeder } from './seeders/auto-user.seeder';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available app-wide
    }),
    // SequelizeModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     dialect:"mysql",
    //     host: "localhost",
    //     port: 3306,
    //     username: "root",
    //     password: "197508",
    //     database: "cafe-system",
    //     autoLoadModels: true,
    //     synchronize: true, // Set false in production
    //   }),
    //   inject: [ConfigService],
    // }),
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: process.env.DB_STORAGE || join(__dirname,'..', 'data', 'database.sqlite'),
      autoLoadModels: true,
      synchronize: true, // لا تنسى إلغاءه في الإنتاج
    }),
    UserModule,
    SequelizeModule.forFeature([User]),
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
  providers:[AutoUserSeeder]
})
export class AppModule {}
