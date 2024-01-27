import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'
import { User } from '@prisma/client'
import { VerifyCallback } from 'passport-google-oauth20'

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
