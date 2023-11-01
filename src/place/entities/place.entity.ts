import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Place extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
  })
  nameAddress: string

  @Column()
  city: string

  @Column()
  name: string

  @Column()
  type: string

  @Column()
  address: string

  @Column({
    type: 'enum',
    enum: ['open', 'closure'],
  })
  status: string

  @Column()
  lat: string

  @Column()
  lon: string

  @Column()
  score: number
}
