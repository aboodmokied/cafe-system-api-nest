// src/seeders/auto-user.seeder.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AutoUserSeeder implements OnApplicationBootstrap {
  constructor(
    private readonly config: ConfigService,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  async onApplicationBootstrap() {
    const email = this.config.get<string>('SEED_ADMIN_EMAIL');
    const password = this.config.get<string>('SEED_ADMIN_PASSWORD');
    const name = this.config.get<string>('SEED_ADMIN_NAME');

    if (!email || !password || !name) {
      console.log('⏩ معلومات المستخدم من .env غير مكتملة. تم تخطي seeding.');
      return;
    }

    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      console.log('✅ المستخدم موجود مسبقًا. تم تخطي seeding.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN',
    });

    console.log('🌱 تم إنشاء مستخدم المدير بنجاح عند بدء التطبيق.');
  }
}
