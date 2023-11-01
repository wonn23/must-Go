import { Injectable } from '@nestjs/common/decorators'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { RestaurantRepository } from './restaurant.repository'

@Injectable()
export class ScheduleService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private restaurantRepository: RestaurantRepository,
  ) {}

  async getRestaurantData() {
    try {
      const key = await this.configService.get<string>('schedule.apiKey')
      const foodList = ['jpnfood', 'chifood', 'lunch']
      const pIndex = 1
      const pSize = 1000
      let GenrestrtFood = ''
      let uniqueData

      for (const food of foodList) {
        let collectedData = []

        console.log(food)
        const apiUrl = `https://openapi.gg.go.kr/Genrestrt${food}?KEY=${key}&Type=json&pIndex=${pIndex}&pSize=${pSize}`
        const response = await lastValueFrom(this.httpService.get(apiUrl))
        GenrestrtFood = 'Genrestrt' + food
        const totalCount =
          response.data[GenrestrtFood][0].head[0].list_total_count // 데이터 총 수
        collectedData = collectedData.concat(
          response.data[GenrestrtFood][1].row,
        ) // foodList에 있는 모든 데이터
        // response.data[GenrestrtFood][1].row = [{맛집 1}, {맛집 2}, ... 1000개]
        // collectedData = {}

        /*
const result = {};

collectedData.forEach(row => {
  const { nameAddress, ...rest } = row;
  result[nameAddress] = rest;
});
  객체도 for문을 돌릴 수 있다.
{
  'nameAddress1': { name: '맛집1', location: '서울' },
  'nameAddress2': { name: '맛집2', location: '부산' },
}
        */
        const totalPages = Math.ceil(totalCount / pSize)
        for (let index = 2; index <= totalPages; index++) {
          console.log(index)
          const nextPageUrl = `https://openapi.gg.go.kr/Genrestrt${food}?KEY=${key}&Type=json&pIndex=${index}&pSize=${pSize}`
          const nextPageResponse = await lastValueFrom(
            this.httpService.get(nextPageUrl),
          )
          collectedData = collectedData.concat(
            nextPageResponse.data[GenrestrtFood][1].row,
          )
        }
        collectedData = collectedData
          .filter(
            (data) =>
              data.BSN_STATE_NM !== '폐업' &&
              data.REFINE_ROADNM_ADDR !== null &&
              data.REFINE_WGS84_LAT !== null &&
              data.REFINE_WGS84_LOGT !== null,
          )
          .map((data) => {
            return {
              nameAddress: `${data.BIZPLC_NM}${data.REFINE_ROADNM_ADDR.replace(
                /\s/g,
                '',
              )}`, // nameAddress 필드에 BIZPLC_NM 값과 띄어쓰기를 제거한 REFINE_ROADNM_ADDR 값을 조합하여 할당
              countyName: data.SIGUN_NM, // countyName 필드에 SIGUN_NM 값을 할당
              name: data.BIZPLC_NM, // name 필드에 BIZPLC_NM 값을 할당
              type: data.SANITTN_BIZCOND_NM, // type 필드에 SANITTN_BIZCOND_NM 값을 할당
              address: data.REFINE_ROADNM_ADDR, // address 필드에 REFINE_ROADNM_ADDR 값을 할당
              lat: data.REFINE_WGS84_LAT, // lat 필드에 REFINE_WGS84_LAT 값을 할당
              lon: data.REFINE_WGS84_LOGT, // lon 필드에 REFINE_WGS84_LOGT 값을 할당
              score: 0, // score 필드에 초기 점수를 할당
            }
          })
        // const result = {}
        // collectedData.forEach((row) => {
        //   const { nameAddress, ...rest } = row
        //   result[nameAddress] = rest
        // })
        // uniqueData = new Set([{정제된 맛집 1}, { 정제된 맛집 2} ...])
        uniqueData = Array.from(
          new Set(collectedData.map((item) => item.nameAddress)),
        ).map((nameAddress) => {
          return collectedData.find((item) => item.nameAddress === nameAddress)
        })
        // console.log(typeof uniqueData, uniqueData)
        await this.restaurantRepository.upsert(uniqueData, ['nameAddress'])
      }

      // 전처리 : 폐업 제거, 필드명 변경, 고유아이디 생성
      // 일식 -> 데이터를 폐업 걸러서 저장 끝
      // 중식에서 -> 데이터 폐업 걸러서 저장
      // collectedData = collectedData
      //   .filter(
      //     (data) =>
      //       data.BSN_STATE_NM !== '폐업' &&
      //       data.REFINE_ROADNM_ADDR !== null &&
      //       data.REFINE_WGS84_LAT !== null &&
      //       data.REFINE_WGS84_LOGT !== null,
      //   )
      //   .map((data) => {
      //     return {
      //       nameAddress: `${data.BIZPLC_NM}${data.REFINE_ROADNM_ADDR.replace(
      //         /\s/g,
      //         '',
      //       )}`, // nameAddress 필드에 BIZPLC_NM 값과 띄어쓰기를 제거한 REFINE_ROADNM_ADDR 값을 조합하여 할당
      //       countyName: data.SIGUN_NM, // countyName 필드에 SIGUN_NM 값을 할당
      //       name: data.BIZPLC_NM, // name 필드에 BIZPLC_NM 값을 할당
      //       type: data.SANITTN_BIZCOND_NM, // type 필드에 SANITTN_BIZCOND_NM 값을 할당
      //       address: data.REFINE_ROADNM_ADDR, // address 필드에 REFINE_ROADNM_ADDR 값을 할당
      //       lat: data.REFINE_WGS84_LAT, // lat 필드에 REFINE_WGS84_LAT 값을 할당
      //       lon: data.REFINE_WGS84_LOGT, // lon 필드에 REFINE_WGS84_LOGT 값을 할당
      //       score: 0, // score 필드에 초기 점수를 할당
      //     }
      //   })
      // 데이터 베이스에 넣기
      // 중복 제거
      return uniqueData
    } catch (error) {
      console.error(error)
    }
  }
}
