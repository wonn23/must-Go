import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { WebhookService } from './webhook.service'
import { WebhookRepository } from './webhook.repository'

@Module({
  imports: [
    HttpModule
  ],
  providers: [
    WebhookService,
    WebhookRepository
  ],
  
})
export class WebhookModule {}