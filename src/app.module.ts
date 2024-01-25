import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { AppService } from './app.service'
import { PrismaService } from './prisma/prisma.service'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
