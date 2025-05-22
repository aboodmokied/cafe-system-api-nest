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
    CardImportModule
  ],
})
export class AppModule {}
