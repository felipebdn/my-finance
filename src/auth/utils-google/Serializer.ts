import { PassportSerializer } from '@nestjs/passport'
import { VerifyCallback } from 'passport-google-oauth20'
import { User } from '@prisma/client'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor() {
    super()
  }

  serializeUser(user: User, done: VerifyCallback) {
    done(null, user)
  }

  async deserializeUser(payload: User, done: VerifyCallback) {
    return done(null, payload)
  }
}
