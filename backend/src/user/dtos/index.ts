import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  IsAlphanumeric,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
} from 'class-validator';
import { IsUid } from 'src/common/validators/is-uid.decorator';
import { SortArrayValid } from 'src/common/validators/sort-array-valid.decorator';
import { ArrayContainsOneOf } from 'src/common/validators/array-contain-one-of.decorator';
import { Transform } from 'class-transformer';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsNotEmpty({ message: 'uid不得為空' })
  @IsUid({ message: 'uid格式錯誤' })
  uid: string;

  @IsOptional()
  @IsNotEmpty({ message: '名稱不得為空' })
  @Length(1, 10, { message: '長度需為 1 至 10 字' })
  name: string;

  @IsNotEmpty({ message: 'roleId不得為空' })
  @IsNumber()
  roleId: number;

  @IsNotEmpty({ message: 'departmentId不得為空' })
  @IsNumber()
  departmentId: number;
}

export class ChangeUserNameDto {
  @IsNotEmpty({ message: '名稱不得為空' })
  @Length(1, 10, { message: '長度需為 1 至 10 字' })
  name: string;

  @IsNotEmpty({ message: '版本戳不得為空' })
  @IsNumber()
  version: number;
}

export class ChangePasswordDto {
  @IsNotEmpty({ message: '密碼不得為空' })
  @IsString()
  @IsAlphanumeric('en-US', { message: '密碼只能包含英文與數字' })
  @Length(6, 20, { message: '密碼長度需為 6 至 20 字' })
  newPassword: string;

  @IsNotEmpty({ message: '確認密碼不得為空' })
  @IsString()
  @IsAlphanumeric('en-US', { message: '密碼只能包含英文與數字' })
  @Length(6, 20, { message: '密碼長度需為 6 至 20 字' })
  confirmPassword: string;

  @IsNotEmpty({ message: '版本戳不得為空' })
  @IsNumber()
  version: number;
}

export class SwitchStatusDto {
  @IsNotEmpty({ message: '版本戳不得為空' })
  @IsNumber()
  version: number;
}

export class EditUserDto extends PartialType(OmitType(CreateUserDto, ['uid'])) {
  @IsNotEmpty({ message: '版本戳不得為空' })
  @IsNumber()
  version: number;
}

const ALLOWED_FIELDS = [
  'id',
  'uid',
  'name',
  'balance',
  'department',
  'role',
  'isInit',
  'isDisable',
  'version',
];
const ALLOWED_SORTS = ['id', 'uid', 'name', 'balance', 'department'];
export class GetUsersQueryDto {
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @ArrayContainsOneOf(ALLOWED_FIELDS)
  fields?: string[];

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
  showDisable?: boolean;
}
