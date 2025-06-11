import { Model } from "sequelize-typescript";

export class CustomModel extends Model {
    static async findWithPagination(page:number,limit:number,otherOptions:any={}){
        const offset = (page - 1) * limit;
        const data = await this.findAll({
            limit,
            offset,
            ...otherOptions
        });

        const {where}=otherOptions;
        const count = await this.count({
            where
        });

        const totalPages = Math.ceil(count / limit);

        return{
            data,
            pagination: {
                page,
                limit,
                totalPages,
            },
        }
    }
};