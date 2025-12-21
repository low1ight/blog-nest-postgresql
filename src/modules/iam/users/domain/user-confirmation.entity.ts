import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('users_confirmation')
export class UserConfirmation {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => User, (user) => user.confirmation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  isConfirmed: boolean;

  @Column({ nullable: true })
  confirmationCode: string;

  @Column({ nullable: true, type: 'timestamptz' })
  codeExpirationDate: Date;
}
