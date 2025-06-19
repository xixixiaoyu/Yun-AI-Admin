import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import {
  PermissionType,
  PermissionStatus,
} from '../../common/mock/mock-data.service';
import { Role } from './role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true, length: 100 })
  code: string;

  @Column({
    type: 'enum',
    enum: PermissionType,
    default: PermissionType.MENU,
  })
  type: PermissionType;

  @Column({ name: 'parent_id', nullable: true })
  parentId?: string;

  @Column({ length: 255, nullable: true })
  path?: string;

  @Column({ length: 255, nullable: true })
  component?: string;

  @Column({ length: 50, nullable: true })
  icon?: string;

  @Column({ default: 0 })
  sort: number;

  @Column({
    type: 'enum',
    enum: PermissionStatus,
    default: PermissionStatus.ACTIVE,
  })
  status: PermissionStatus;

  @Column({ length: 255, nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Permission, (permission) => permission.children)
  @JoinColumn({ name: 'parent_id' })
  parent?: Permission;

  @OneToMany(() => Permission, (permission) => permission.parent)
  children?: Permission[];

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
