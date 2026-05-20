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
  MaxLength,
} from 'class-validator';
import { EnglishLevel, Gender, Goal } from '../../users/models/user.model';

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
  @IsEnum(EnglishLevel)
  english_level?: EnglishLevel;

  @IsOptional()
  @IsEnum(Goal)
  goal?: Goal;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  goal_text?: string;
}
