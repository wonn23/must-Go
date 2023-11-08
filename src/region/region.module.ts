import { Module } from '@nestjs/common'
import { RegionController } from './region.controller'
import { RegionService } from './region.service'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}
