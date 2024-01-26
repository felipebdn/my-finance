import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as session from 'express-session'

import { AppModule } from './app.module'
import { Env } from './env'

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
