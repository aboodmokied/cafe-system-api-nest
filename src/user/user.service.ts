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
        console.log({
          a:  process.env.JWT_SECRET,
          b:  process.env.SEED_ADMIN_EMAIL,
        })
        if(user && bcrypt.compareSync(password,user.password)){
            return user;
        }
        return null;
    }

    async registerUser({name,email,password}:{name:string,email:string,password:string}){
        return this.userModel.create({name,email,password:bcrypt.hashSync(password,12)})
    }
    // async getUserById(email:string){
    //     return this.userModel.findOne({where:{email}});
    // }
}
