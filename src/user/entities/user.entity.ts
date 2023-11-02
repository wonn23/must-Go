import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

@Entity('users')
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column({ length: 50 })
  username: string

  @Column()
  password: string

  @Column({ nullable: false, type: 'varchar', default: '0' })
  lat: string

  @Column({ nullable: false, type: 'varchar', default: '0' })
  lon: string

  @Column({ nullable: false, type: 'boolean', default: false })
  lunchServiceYn: boolean
}
