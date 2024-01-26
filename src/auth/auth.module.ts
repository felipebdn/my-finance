import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { GoogleStrategy } from './utils/GoogleStrategy'

@Module({
  imports: [],
  providers: [GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
