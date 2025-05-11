import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User
    ){}

    async validateUser(email:string,password:string){
        const user=await this.userModel.findOne({where:{email}})
        if(user && bcrypt.compareSync(password,user.password)){
            return user;
        }
        return null;
    }
}
