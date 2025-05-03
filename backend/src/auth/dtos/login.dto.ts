import { IsNotEmpty, IsString } from 'class-validator';
import { IsUid } from 'src/common/validators/is-uid.decorator';

export class LoginDto {
  @IsNotEmpty({ message: 'uid不得為空' })
  @IsUid({ message: 'uid格式錯誤' })
  uid: string;

  @IsNotEmpty({ message: '密碼不得為空' })
  @IsString()
  password: string;
}
