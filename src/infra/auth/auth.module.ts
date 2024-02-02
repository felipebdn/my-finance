import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { EnvService } from '../env/env.service'
import { GoogleStrategy } from './utils-google/GoogleStrategy'
import { SessionSerializer } from './utils-google/Serializer'
import { JwtAuthGuard } from './utils-jwt/jwt-auth.guard'
import { JwtStrategy } from './utils-jwt/jwt-strategy'

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(env: EnvService) {
        const privateKey = env.get('JWT_PRIVATE_KEY')
        const publicKey = env.get('JWT_PUBLIC_KEY')
        return {
          signOptions: {
            algorithm: 'RS256',
            expiresIn: '7d',
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
    EnvService,
    GoogleStrategy,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
