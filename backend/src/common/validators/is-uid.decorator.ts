// src/common/validators/is-uid.decorator.ts
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsUid(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isUid',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const regex = /^(?=.{3,30}$)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} 必須小寫英文字母開頭，可包含數字與單一連字號，長度 3–30`;
        },
      },
    });
  };
}
