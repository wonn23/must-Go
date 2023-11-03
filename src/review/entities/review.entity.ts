import { Restaurant } from 'src/restaurant/entities/restaurant.entity'
import { User } from 'src/user/entities/user.entity'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'double precision' })
  score: number

  @Column()
  content: string

  @CreateDateColumn({ nullable: false })
  createdAt: Date

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date

  @DeleteDateColumn({ nullable: false })
  deletedAt?: Date

  @ManyToOne(() => User, (user) => user.reviews)
  user: User
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews)
  restaurant: Restaurant
}
