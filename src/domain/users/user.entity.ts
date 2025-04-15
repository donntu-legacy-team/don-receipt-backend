import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  USER = 'USER',
  MODER = 'MODER',
  ADMIN = 'ADMIN',
}

export type RolesWeights = {
  [UserRole.USER]: number;
  [UserRole.MODER]: number;
  [UserRole.ADMIN]: number;
};

export const ROLES_WEIGHTS: RolesWeights = {
  [UserRole.USER]: 1,
  [UserRole.MODER]: 2,
  [UserRole.ADMIN]: 3,
};

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  registeredAt: Date;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: false })
  emailConfirmed: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
