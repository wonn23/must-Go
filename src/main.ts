import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe, Logger } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const swaggerConfig = new DocumentBuilder()
    .setTitle('please insert project name')
    .setDescription('The [project name] API description')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('user')
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('swagger', app, document)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      skipMissingProperties: true,
    }),
  )

  const configService = app.get(ConfigService)
  const port = configService.get('PORT') || 3000
  await app.listen(port)
  Logger.log(`Application running on port ${port}`)
}
bootstrap()
