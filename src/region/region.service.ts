import { Injectable } from '@nestjs/common'
import { csvToJSON } from './utils/csvToJson'
import * as fs from 'fs'

@Injectable()
export class RegionService {
  private koreaRegion: object[] = []
  fileName = 'sgg_lat_lon'
  path = `Src/region/data/${this.fileName}.csv`
  constructor() {
    this.loadCsvDate()
  }

  getKoreaRegion(dosi?: string, sgg?: string): object[] {
    if (dosi === undefined && sgg === undefined) return this.koreaRegion

    const result = this.koreaRegion.filter((raw) => {
      if (dosi !== undefined && sgg === undefined) return raw['do-si'] === dosi
      else if (dosi === undefined && sgg !== undefined)
        return raw['sgg'] === sgg
      else return raw['sgg'] === sgg && raw['do-si'] === dosi
    })

    return result
  }

  private loadCsvDate() {
    const file_csv = fs.readFileSync(this.path, 'utf8')
    const string_csv = file_csv.toString()
    this.koreaRegion = csvToJSON(string_csv)
  }
}
