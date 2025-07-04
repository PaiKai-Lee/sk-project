import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  IsAlphanumeric,
  Matches,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
} from 'class-validator';
import { IsUid } from 'src/common/validators/is-uid.decorator';
import { SortArrayValid } from 'src/common/validators/sort-array-valid.decorator';
import { ArrayContainsOneOf } from 'src/common/validators/array-contain-one-of.decorator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty({ message: 'uid不得為空' })
  @IsUid({ message: 'uid格式錯誤' })
  uid: string;

  @IsNotEmpty({ message: 'roleId不得為空' })
  @IsNumber()
  roleId: number;
}

export class ChangeUserNameDto {
  @IsNotEmpty({ message: '名稱不得為空' })
  @Matches(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/, {
    message: '只能包含中文、英文與數字',
  })
  @Length(1, 10, { message: '長度需為 1 至 10 字' })
  name: string;
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
}

const ALLOWED_FIELDS = [
  'id',
  'uid',
  'name',
  'balance',
  'role',
  'isInit',
  'isDisable',
  'version',
];
const ALLOWED_SORTS = ['id', 'uid', 'name', 'balance'];
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
