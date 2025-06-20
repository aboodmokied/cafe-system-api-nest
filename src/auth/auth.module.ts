import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './token.model';
 
@Module({
  imports:[
    PassportModule,
    // JwtModule.register({
    //   secret:process.env.JWT_SECRET,
    //   signOptions:{
    //     expiresIn:process.env.JWT_EXPIRATION
    //   }
    // }),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory:async(configService:ConfigService)=>({
        secret:configService.get<string>('JWT_SECRET') || 'abood',
        signOptions:{
          expiresIn:configService.get<string>('JWT_EXPIRATION') || '1d',
        },
      }),
      inject:[ConfigService]
    }),
    forwardRef(() => UserModule),
    SequelizeModule.forFeature([Token])
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtAuthGuard],
  exports: [JwtAuthGuard,AuthService]
})
export class AuthModule {}
