import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { ClsModule } from 'nestjs-cls'

import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { envSchema } from './env'
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
    PassportModule.register({ session: true }),
  ],
  providers: [],
})
export class AppModule {}
