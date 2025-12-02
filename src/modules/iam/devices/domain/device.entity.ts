import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToOne(() => User, (user) => user.devices)
  user: User;
}
