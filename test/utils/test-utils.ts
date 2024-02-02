import { INestApplication } from '@nestjs/common'
import session from 'express-session'

import { EnvService } from '@/infra/env/env.service'

export const configureSession = (
  app: INestApplication,
  envService: EnvService,
) => {
  app.use(
    session({
      secret: envService.get('SESSION_SECRET'), // Use a chave secreta do envService
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  )
}
