import { Op } from "sequelize";
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
    static async findWithPaginationAndSearch(page:number,limit:number,otherOptions:any={},q:string,whiteList:string[]){
        const offset = (page - 1) * limit;
        const searchOptions={
            [Op.or]:whiteList.map(column=>({
                [column]:{[Op.like]: `%${q}%`}
            }))
        };
        const {where,...options}=otherOptions;
        const whereOptions={
            ...where,
            ...searchOptions
        };
        const data = await this.findAll({
            where:whereOptions,
            limit,
            offset,
            ...options,
        });

        const count = await this.count({
            where:whereOptions
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