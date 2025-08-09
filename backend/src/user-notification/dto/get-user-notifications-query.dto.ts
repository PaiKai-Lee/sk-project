import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class GetUserNotificationsQueryDto {
  @IsOptional()
  @IsIn(['all', 'unread'])
  status?: 'all' | 'unread' = 'all';

  
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cursor?: number;
}
