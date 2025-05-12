import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[SequelizeModule.forFeature([User]),forwardRef(() => AuthModule),],
  providers: [UserService],
  controllers: [UserController],
  exports:[UserService]
})
export class UserModule {}
