import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  Max,
} from 'class-validator';
import { EduLevel, EnglishLevel, Gender } from '../../users/models/user.model';

export class SignUpDto {
  @IsString()
  @Length(3, 30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username must contain only letters, numbers, and _',
  })
  username: string;

  @IsString()
  @Length(2, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 64)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'The password must contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(120)
  age?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(EduLevel)
  edu_level?: EduLevel;

  @IsOptional()
  @IsEnum(EnglishLevel)
  english_level?: EnglishLevel;
}
