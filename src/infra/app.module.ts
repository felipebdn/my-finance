import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { ClsModule } from 'nestjs-cls'

import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { envSchema } from './env/env'
import { EnvModule } from './env/env.module'
import { EnvService } from './env/env.service'
import { HttpModule } from './http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    ClsModule.forRoot({
      global: true,
      guard: {
        mount: true,
      },
    }),
    AuthModule,
    HttpModule,
    DatabaseModule,
    EnvModule,
    PassportModule.register({ session: true }),
  ],
  providers: [EnvService],
})
export class AppModule {}
