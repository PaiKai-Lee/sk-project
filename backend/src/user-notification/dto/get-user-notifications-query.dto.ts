import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class GetUserNotificationsQueryDto {
  @IsOptional()
  @IsIn(['all', 'unread'])
  status?: 'all' | 'unread' = 'all';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;
}
