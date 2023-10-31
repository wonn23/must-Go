// schedule.service.ts

import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import axios from 'axios'

@Injectable()
export class ScheduleService {
  @Cron(CronExpression.EVERY_HOUR) // 매 시간마다 실행 (필요에 따라 조절)
  async fetchDataFromOpenAPI() {
    try {
      // OpenAPI에서 데이터를 가져오는 요청 예제
      const response = await axios.get(
        `https://openapi.gg.go.kr/Genrestrtlunch?key=41a78115926c4c76b39caf0d7be93b6e&type=json&pIndex=2&pSize=1000`,
      )
      const data = response.data

      // 데이터를 활용한 로직을 여기에 추가
      console.log('데이터 가져오기 성공:', data)
    } catch (error) {
      console.error('데이터 가져오기 실패:', error.message)
    }
  }
}
