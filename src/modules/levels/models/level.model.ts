import { User } from '@/modules/users/models/user.model';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'levels',
  timestamps: false,
  underscored: true,
})
export class Level extends Model<Level> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  declare level_number: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare min_exp: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare badge_icon: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare reward_desc: string;
}
