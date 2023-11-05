import { Injectable, Logger } from "@nestjs/common"
import { Cron } from '@nestjs/schedule'
import { WebhookRepository } from "./webhook.repository"
import { HttpService } from "@nestjs/axios"
import payloads from "./webhook.payloads"
import calculator from "src/util/calculator.util"

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name)

  constructor(
    private webhookRepository: WebhookRepository,
    private httpService: HttpService
  ) {}

  @Cron('*/5 * * * * *') // 오전 11시 30분마다 실행
  async SendLunchRecommendation() {
    this.logger.log('start discord lunch service')

    // 점심 추천 서비스 이용 유저 대상자 조회
    const userList = await this.webhookRepository.findServiceUser('lunchServiceYn')

    this.logger.log(`lunch service user: ${JSON.stringify(userList)}`)

    if (userList[0]) {
      for (let user of userList) {
        // 거리 계산
        const { lat, lon } = user
        const range = 0.5 // (km)
        const rangePoint = calculator.getMinMaxPointByRectangle(parseFloat(lat), parseFloat(lon), range)

        const restaurantList = await this.webhookRepository.findRestaurantByRange(rangePoint)

        const msgFormat = {
          "중국식": { "name": "🥢중식", "value": "", "inline": true },
          "김밥(도시락)": { "name": "🍱도시락", "value": "", "inline": true },
          "일식": { "name": "🍥일식", "value": "", "inline": true }
        }

        for (let restaurant of restaurantList) {
          msgFormat[restaurant.type].value += `**${restaurant.name}** \n ${restaurant.address} \n 평점: ${restaurant.score} \n\n `
        }

        const msgData = Object.values(msgFormat).filter(data => {
          return data.value !== ''
        })

        // send message
        const message = payloads.LUNCH_REC(Object.values(msgData))
        const discordUrl = process.env.DISCORD_URL // 유저마다 다른 url을 저장 중인 것으로 가정하고 테이블 수정되면 DB에서 뽑아온 정보로 변경
  
        await this.httpService
          .post(discordUrl, message)
          .subscribe({
            complete: () => {
              console.log('completed')
            },
            error: (err) => {
              console.log(err)
            }
          })
      }
    }

  }
}