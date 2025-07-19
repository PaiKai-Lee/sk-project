import { Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { SortArrayValid } from 'src/common/validators/sort-array-valid.decorator';

const ALLOWED_SORTS = ['id', 'uid', 'createdAt'];

export class GetAuditLogsDto {
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
  @IsString()
  uid?: string;

  @IsOptional()
  @IsString()
  ip?: string;
}
