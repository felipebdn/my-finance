import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { Env } from '../env'
import { GoogleStrategy } from './utils-google/GoogleStrategy'
import { SessionSerializer } from './utils-google/Serializer'
import { JwtAuthGuard } from './utils-google/utils-jwt/jwt-auth.guard'
import { JwtStrategy } from './utils-google/utils-jwt/jwt-strategy'

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
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
