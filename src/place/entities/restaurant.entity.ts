import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

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

  @Column()
  lat: string

  @Column()
  lon: string

  @Column()
  score: number

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date
  // @ManyToOne(() => Rating, (rating) => restaurants)
  // rating: Rating
}
