import { Restaurant } from '../../restaurant/entities/restaurant.entity'
import { User } from '../../user/entities/user.entity'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
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
  @JoinColumn({ name: 'userId' }) // 외래 키 설정
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews)
  @JoinColumn({ name: 'restaurantId' }) // 외래 키 설정
  restaurant: Restaurant
}
