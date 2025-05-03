// src/common/validators/is-password.decorator.ts
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsPassword(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const pwdRegex = /^(?=.{8,64}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{}|;:'",.<>\/?])[^\s]+$/;
          return typeof value === 'string' && pwdRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} 必須為 6–64 字元，包含大／小寫、數字、特殊字元，且不可有空白`;
        },
      },
    });
  };
}
