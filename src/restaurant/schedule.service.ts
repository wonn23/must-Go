import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { RestaurantRepository } from './restaurant.repository'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name)

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private restaurantRepository: RestaurantRepository,
  ) {}

  @Cron('0 1 * * 5')
  async sendRequest() {
    this.logger.debug('Called every Friday at 1 AM')

    try {
      await this.getRestaurantData()
      this.logger.log('Data updated successfully')
    } catch (error) {
      this.logger.error(`Failed to update data : ${error}`)
    }
  }

  private async fetchData(
    food: string,
    index: number,
  ): Promise<{ data: any[]; totalCount: number }> {
    // 공공데이터 api 호출, data와 총 row수 반환
    const key = await this.configService.get<string>('schedule.apiKey')
    const pSize = 1000
    const apiUrl = `https://openapi.gg.go.kr/Genrestrt${food}?KEY=${key}&Type=json&pIndex=${index}&pSize=${pSize}`
    const response = await lastValueFrom(this.httpService.get(apiUrl))
    const GenrestrtFood = 'Genrestrt' + food
    const data = response.data[GenrestrtFood][1].row
    const totalCount = response.data[GenrestrtFood][0].head[0].list_total_count
    return { data, totalCount }
  }

  private transformData(data: any[]): any[] {
    // 데이터 전처리
    return data
      .filter(
        (data) =>
          data.REFINE_ROADNM_ADDR !== null &&
          data.REFINE_WGS84_LAT !== null &&
          data.REFINE_WGS84_LOGT !== null,
      )
      .map((data) => ({
        nameAddress:
          `${data.BIZPLC_NM}${data.REFINE_ROADNM_ADDR}${data.SANITTN_BIZCOND_NM}`.replace(
            /\s/g,
            '',
          ), // nameAddress 필드에 BIZPLC_NM 값과 띄어쓰기를 제거한 REFINE_ROADNM_ADDR 값을 조합하여 할당
        countyName: data.SIGUN_NM || '미확인', // countyName 필드에 SIGUN_NM 값을 할당
        name: data.BIZPLC_NM || '미확인', // name 필드에 BIZPLC_NM 값을 할당
        type: data.SANITTN_BIZCOND_NM || '미확인', // type 필드에 SANITTN_BIZCOND_NM 값을 할당
        address: data.REFINE_ROADNM_ADDR, // address 필드에 REFINE_ROADNM_ADDR 값을 할당
        status: data.BSN_STATE_NM || '미확인', // status 필드에 BSN_STATE_NM 값을 할당. 없을 시 미확인
        lat: data.REFINE_WGS84_LAT, // lat 필드에 REFINE_WGS84_LAT 값을 할당
        lon: data.REFINE_WGS84_LOGT, // lon 필드에 REFINE_WGS84_LOGT 값을 할당
        score: 0, // score 필드에 초기 점수를 할당
      }))
  }

  private removeDuplicates(data: any[]): any[] {
    // 중복 데이터 삭제
    return Array.from(new Set(data.map((item) => item.nameAddress))).map(
      (nameAddress) => {
        return data.find((item) => item.nameAddress === nameAddress)
      },
    )
  }

  async getRestaurantData() {
    try {
      const foodList = ['jpnfood', 'chifood', 'lunch']
      for (const food of foodList) {
        const { data: initialData, totalCount } = await this.fetchData(food, 1) // 초기 1000개의 데이터 호출 (totalCount 반환을 위해 분리)

        const totalPages = Math.ceil(totalCount / 1000)
        let data = this.transformData(initialData)
        let uniqueData = this.removeDuplicates(data) // null값 처리 + 중복 제거 데이터
        await this.restaurantRepository.upsert(uniqueData, ['nameAddress'])

        for (let index = 2; index <= totalPages; index++) {
          const fetchedData = await this.fetchData(food, index)
          data = this.transformData(fetchedData.data)
          uniqueData = this.removeDuplicates(data)
          await this.restaurantRepository.upsert(uniqueData, ['nameAddress'])
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
}
