import { IsArray, IsNotEmpty, IsString } from 'class-validator';

interface TargetPayload {
  [uid: string]: Record<string, any>;
}

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsString({ each: true })
  targets: string[];
}
