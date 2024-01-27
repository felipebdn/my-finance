import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { PrismaService } from './database/prisma/prisma.service'
import { envSchema } from './env'
import { HttpModule } from './http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    DatabaseModule,
    PassportModule.register({ session: true }),
  ],
  providers: [PrismaService],
})
export class AppModule {}
