import { Repository } from 'typeorm'
import { CustomRepository } from '../common/decorator/typeorm-ex.decorator'
import { Review } from './entities/review.entity'

@CustomRepository(Review)
export class ReviewRepository extends Repository<Review> {}
