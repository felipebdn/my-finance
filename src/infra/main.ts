import { NestFactory } from '@nestjs/core'
import * as session from 'express-session'

import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })
  const envService = app.get(EnvService)
  const port = envService.get('PORT')
  const secret = envService.get('SESSION_SECRET')

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
