import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserPasswordRecovery } from './user-password-recovery.entity';
import { UserConfirmation } from './user-confirmation.entity';

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

  @Column({ type: 'timestamptz' }) // Recommended
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
}
