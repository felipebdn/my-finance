import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'
import * as session from 'express-session'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })
  const configService = app.get<ConfigService<Env>>(ConfigService)
  const port = configService.get('PORT', { infer: true })
  const secret = configService.get('SESSION_SECRET', { infer: true })

  app.use(
    session({
      secret,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  )

  await app.listen(port)
}
bootstrap()
