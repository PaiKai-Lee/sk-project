import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
export class CreateTransactionItemDto {
  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  value: number;

  @IsOptional()
  @IsString()
  details: string;
}

export class CreateTransactionDto {
  @IsOptional()
  @IsString()
  remark: string;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionItemDto)
  items: CreateTransactionItemDto[];
}
