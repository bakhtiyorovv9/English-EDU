import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Level } from '../../levels/models/level.model';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum EduLevel {
  SCHOOL = 'school',
  COLLEGE = 'college',
  BACHELOR = 'bachelor',
  MASTER = 'master',
  PHD = 'phd',
}

export enum EnglishLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class User extends Model<User> {
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
  declare password_hash: string;

  @Column({ type: DataType.INTEGER })
  declare age: number;

  @Column({ type: DataType.ENUM(...Object.values(Gender)) })
  declare gender: Gender;

  @Column({ type: DataType.ENUM(...Object.values(EduLevel)) })
  declare edu_level: EduLevel;

  @Column({ type: DataType.ENUM(...Object.values(EnglishLevel)) })
  declare english_level: EnglishLevel;

  @ForeignKey(() => Level)
  @Column({ type: DataType.INTEGER })
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
