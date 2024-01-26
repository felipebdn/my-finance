import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { PrismaService } from './database/prisma/prisma.service'
import { envSchema } from './env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [],
  providers: [AppService, PrismaService],
})
export class AppModule {}
