import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable, Inject, Scope } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@ValidatorConstraint({ async: true })
@Injectable({ scope: Scope.REQUEST }) // important for per-request injection
export class ExistsInDbConstraint implements ValidatorConstraintInterface {
  constructor(@Inject(Sequelize) private readonly sequelize: Sequelize) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [modelClass, column = 'id'] = args.constraints;
    const result = await modelClass.findOne({ where: { [column]: value } });
    return !!result;
  }

  defaultMessage(args: ValidationArguments): string {
    const [modelClass, column = 'id'] = args.constraints;
    return `${column} does not exist`;
  }
}

export function ExistsInDb(
  modelClass: any,
  column?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [modelClass, column],
      validator: ExistsInDbConstraint,
    });
  };
}
