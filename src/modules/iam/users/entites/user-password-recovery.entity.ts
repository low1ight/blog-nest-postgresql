import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('users_password_recovery')
export class UserPasswordRecovery {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => User, (user) => user.passwordRecovery)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  recoveryCode: string;

  @Column({ nullable: true, type: 'timestamptz' })
  codeExpirationDate: Date;
}
