import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function ArrayContainsOneOf(values: any[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'arrayContainsOneOf',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [values],
      validator: {
        validate(value: any[], args: ValidationArguments) {
          const required = args.constraints[0];
          return Array.isArray(value) && required.some(v => value.includes(v));
        },
        defaultMessage(args: ValidationArguments) {
          const required = args.constraints[0];
          return `${args.property} 必須包含: ${required.join(', ')}`;
        }
      }
    });
  };
}
