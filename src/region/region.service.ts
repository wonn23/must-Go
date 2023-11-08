import { Injectable, Inject } from '@nestjs/common'
import { csvToJSON } from './utils/csvToJson'
import * as fs from 'fs'
import { ICACHE_SERVICE } from 'src/common/provider.constant'
import { CacheService } from 'src/cache/cache.service'

@Injectable()
export class RegionService {
  fileName = 'sgg_lat_lon'
  path = `Src/region/data/${this.fileName}.csv`

  private cacheKey = 'region'
  constructor(
    @Inject(ICACHE_SERVICE)
    private readonly cacheService: CacheService,
  ) {
    this.loadCsvDate()
  }

  // 캐시에서 시군구 데이터 불러오기
  async getKoreaRegion(dosi?: string, sgg?: string): Promise<object[]> {
    const regions = await this.cacheService.getFromCache<object[]>(
      this.cacheKey,
    )

    if (dosi === undefined && sgg === undefined) return regions

    const result = regions.filter((raw) => {
      if (dosi !== undefined && sgg === undefined) return raw['do-si'] === dosi
      else if (dosi === undefined && sgg !== undefined)
        return raw['sgg'] === sgg
      else return raw['sgg'] === sgg && raw['do-si'] === dosi
    })

    return result
  }

  // 앱 실행시 시군구 csv 데이터 json 형태로 redis 캐시에 저장
  private async loadCsvDate() {
    const file_csv = fs.readFileSync(this.path, 'utf8')
    const string_csv = file_csv.toString()
    const result = csvToJSON(string_csv)
    await this.cacheService.setCache(this.cacheKey, result)
  }
}
