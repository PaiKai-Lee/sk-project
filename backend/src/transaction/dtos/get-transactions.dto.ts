import { Type } from 'class-transformer';
import {
  IsOptional,
  IsBooleanString,
  IsNumberString,
  IsNumber,
  IsString,
} from 'class-validator';

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
  orderBy?: 'createdAt' | 'transactionId'; // 可擴充其他欄位

  @IsOptional()
  order?: 'asc' | 'desc';

  @IsOptional()
  @IsBooleanString()
  includeItems?: string; // true / false

  @IsOptional()
  @IsBooleanString()
  all?: string;

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
}
