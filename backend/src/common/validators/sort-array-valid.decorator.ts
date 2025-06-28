import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function SortArrayValid(
  allowedFields: string[],
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'sortArrayValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [allowedFields],
      validator: {
        validate(value: any[], args: ValidationArguments) {
          if (!Array.isArray(value)) return false;
          const allowed = args.constraints[0];
          return value.every((item: string) => {
            const [field, order] = item.split(':');
            return (
              allowed.includes(field) &&
              (order === 'asc' || order === 'desc')
            );
          });
        },
        defaultMessage(args: ValidationArguments) {
          const allowed = args.constraints[0];
          return `sort 必須滿足 "field:asc" or "field:desc" 格式, 允許 : ${allowed.join(', ')}`;
        },
      },
    });
  };
}