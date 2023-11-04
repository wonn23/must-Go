import { ApiProperty } from '@nestjs/swagger'
import { Restaurant } from 'src/restaurant/entities/restaurant.entity'
import { User } from 'src/user/entities/user.entity'
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
  @ApiProperty({ description: '리뷰 아이디' })
  id: number

  @Column({ type: 'double precision' })
  @ApiProperty({ description: '리뷰 점수' })
  score: number

  @Column()
  @ApiProperty({ description: '리뷰 내용' })
  content: string

  @CreateDateColumn({ nullable: false })
  @ApiProperty({ description: '리뷰 생성 일자' })
  createdAt: Date

  @UpdateDateColumn({ nullable: false })
  @ApiProperty({ description: '리뷰 수정 일자' })
  updatedAt: Date

  @DeleteDateColumn({ nullable: false })
  @ApiProperty({ description: '리뷰 삭제 일자' })
  deletedAt?: Date

  @ManyToOne(() => User, (user) => user.reviews)
  @ApiProperty({ description: '리뷰 작성자' })
  user: User
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews)
  @JoinColumn({ name: 'restaurantId' }) // 외래 키 설정
  @ApiProperty({ description: '리뷰한 맛집' })
  restaurant: Restaurant
}
