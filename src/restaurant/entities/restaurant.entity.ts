import { Review } from 'src/review/entities/review.entity'
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { statusEnum } from '../types/restaurant.enum'

@Entity()
export class Restaurant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
  })
  nameAddress: string

  @Column()
  countyName: string

  @Column()
  name: string

  @Column()
  type: string

  @Column()
  address: string

  @Column({ type: 'enum', enum: statusEnum, default: statusEnum.unconfirmed })
  status: statusEnum

  @Column()
  lat: string

  @Column()
  lon: string

  @Column({ type: 'double precision' })
  score: number

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Review, (review) => review.restaurant)
  reviews: Review[]
}
