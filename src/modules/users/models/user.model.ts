import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Level } from '../../levels/models/level.model';
import { UserRole } from '@/core/constants/constants';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum Goal {
  IELTS = 'ielts',
  TRAVEL = 'travel',
  WORK = 'work',
  GENERAL = 'general',
}
export enum EnglishLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export interface UserCreationAttrs {
  username: string;
  name: string;
  email: string;
  password: string;
  age?: number;
  gender?: Gender;
  english_level?: EnglishLevel;
  goal?: Goal;
  goal_text?: string;
  role?: UserRole;
  level?: number;
  avatar_url?: string;
  is_verified?: boolean;
  total_exp?: number;
  weekly_exp?: number;
  monthly_exp?: number;
  streak_days?: number;
}

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare username: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.INTEGER })
  declare age: number;

  @Column({ type: DataType.ENUM(...Object.values(Gender)) })
  declare gender: Gender;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.USER,
    allowNull: false,
  })
  declare role: UserRole;

  @Column({ type: DataType.ENUM(...Object.values(EnglishLevel)) })
  declare english_level: EnglishLevel;

  @Column({ type: DataType.ENUM(...Object.values(Goal)) })
  declare goal: Goal;

  @Column({ type: DataType.STRING(160) })
  declare goal_text: string;

  @ForeignKey(() => Level)
  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  declare level: number;

  @BelongsTo(() => Level)
  declare levelInfo: Level;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare total_exp: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare weekly_exp: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare monthly_exp: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare streak_days: number;

  @Column({ type: DataType.STRING })
  declare avatar_url: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_verified: boolean;
}
