import { BaseEntity, Between, EntityManager, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { User } from 'src/user/entities/user.entity'
import { Restaurant } from 'src/restaurant/entities/restaurant.entity'

@Injectable()
export class WebhookRepository extends BaseEntity {
  constructor(
    private manager: EntityManager
  ) { super() }


  async findServiceUser(serviceYn): Promise<Array<{ lat, lon, discordUrl }>> {
    const userList = await this.manager.connection
    .getRepository(User)
    .createQueryBuilder('user')
    .select([
      `user.id AS "userId"`,
      `user.lat AS "lat"`,
      `user.lon AS "lon"`,
      `user.discordUrl AS "discordUrl"`
    ])
    .where(`user.${serviceYn} = true`)
    .andWhere('user.discordUrl IS NOT NULL')
    .getRawMany()

    return userList
  }

  async findRestaurantByRange(rangePoint): Promise<Restaurant[]> {
    const { minLat, maxLat } = rangePoint.lat
    const { minLon, maxLon } = rangePoint.lon
    
    const restaurantList = await this.manager.connection
    .createQueryBuilder()
    .select()
    .from((sub) => {
      return sub
      .select([
        'subRes.name AS name',
        'subRes.address AS address',
        'subRes.type AS type',
        'subRes.score AS score',
        'ROW_NUMBER () OVER (PARTITION BY subRes.type ORDER BY subRes.score DESC) AS scoreRank'
      ])
      .from(Restaurant, 'subRes')
      .where('subRes.lat BETWEEN :minLat AND :maxLat', { minLat, maxLat })
      .andWhere('subRes.lon BETWEEN :minLon AND :maxLon', { minLon, maxLon })
      .andWhere('subRes.status = :status', { status: "영업" })      
    }, 'subQuery')
    .where('scoreRank <= 5')
    .getRawMany();

    return restaurantList
  }
}