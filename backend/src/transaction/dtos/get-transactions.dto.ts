import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsNumberString,
  IsNumber,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
} from 'class-validator';
import { SortArrayValid } from 'src/common/validators/sort-array-valid.decorator';

const ALLOWED_SORTS = ['id', 'createdAt', 'transactionId'];
export class GetTransactionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @SortArrayValid(ALLOWED_SORTS)
  sort?: string[];

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeItems?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  all?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsNumberString()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsNumberString()
  endDate?: Date;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;
}
