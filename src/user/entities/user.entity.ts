import { Review } from 'src/review/entities/review.entity'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { Refresh } from './refresh.entity'

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

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[]

  @OneToOne(() => Refresh, { nullable: true })
  @JoinColumn()
  refresh: Refresh
}
