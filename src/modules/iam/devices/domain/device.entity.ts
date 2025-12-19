import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/domain/user.entity';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column()
  title: string;

  @Column()
  sessionId: string;

  @Column({ type: 'timestamptz' })
  lastActiveDate: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.devices)
  @JoinColumn({ name: 'userId' })
  user: User;
}
