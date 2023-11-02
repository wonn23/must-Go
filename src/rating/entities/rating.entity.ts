import { Restaurant } from 'src/place/entities/restaurant.entity'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Rating extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  score: number

  @Column()
  content: string

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.ratings)
  restaurant: Restaurant
}
