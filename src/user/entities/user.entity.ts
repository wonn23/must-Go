import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50 })
  username: string

  @Column()
  password: string
}
