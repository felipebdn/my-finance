import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { GoogleStrategy } from './utils-google/GoogleStrategy'
import { PrismaUserRepositories } from '@/database/prisma/repositories/prisma-user-repositories'
import { PrismaService } from '@/database/prisma/prisma.service'
import { SessionSerializer } from './utils-google/Serializer'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Env } from '@/env'
import { AuthService } from './auth.service'
import { JwtStrategy } from './utils-jwt/jwt-strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './utils-jwt/jwt-auth.guard'

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<Env, true>) {
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true })
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })
        return {
          signOptions: {
            algorithm: 'RS256',
          },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  providers: [
    JwtStrategy,
    SessionSerializer,
    GoogleStrategy,
    PrismaService,
    PrismaUserRepositories,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
