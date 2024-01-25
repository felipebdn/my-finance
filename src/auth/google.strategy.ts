import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-google-oauth20'
import { Env } from 'src/env'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService<Env, true>) {
    super({
      clientId: configService.get('GOOGLE_CLIENT_ID', { infer: true }),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET', { infer: true }),
    })
  }
}
