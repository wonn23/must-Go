import { Injectable } from '@nestjs/common/decorators'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class ScheduleService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async getPlaceData() {
    const key = await this.configService.get<string>('schedule.apiKey')
    const foodList = ['jpnfood', 'chifood', 'lunch']
    let pIndex = 1
    let pSize = 1000
    let GenrestrtFood = ''

    const dataCollection = {}
    for (const food of foodList) {
      let collectedData = []
      const apiUrl = `https://openapi.gg.go.kr/Genrestrt${food}?KEY=${key}&Type=json&pIndex=${pIndex}&pSize=${pSize}`
      const response = await lastValueFrom(this.httpService.get(apiUrl))
      GenrestrtFood = 'Genrestrt' + food
      const totalCount =
        response.data[GenrestrtFood][0].head[0].list_total_count
      collectedData = collectedData.concat(response.data[GenrestrtFood][1].row)

      const totalPages = Math.ceil(totalCount / pSize)
      for (let i = 2; i <= totalPages; i++) {
        const nextPageUrl = `https://openapi.gg.go.kr/Genrestrt${food}?KEY=${key}&Type=json&pIndex=${pIndex}&pSize=${pSize}`
        const nextPageResponse = await lastValueFrom(
          this.httpService.get(nextPageUrl),
        )
        collectedData = collectedData.concat(
          nextPageResponse.data[GenrestrtFood][1].row,
        )
      }
      dataCollection[food] = collectedData
    }

    return dataCollection
  }
}
