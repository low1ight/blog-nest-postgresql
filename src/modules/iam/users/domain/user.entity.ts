import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserPasswordRecovery } from './user-password-recovery.entity';
import { UserConfirmation } from './user-confirmation.entity';
import { Device } from '../../devices/domain/device.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @OneToOne(
    () => UserPasswordRecovery,
    (passwordRecovery) => passwordRecovery.user,
  )
  passwordRecovery: UserPasswordRecovery;

  @OneToOne(
    () => UserConfirmation,
    (userConfirmation) => userConfirmation.userId,
  )
  confirmation: UserConfirmation;

  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];
}
