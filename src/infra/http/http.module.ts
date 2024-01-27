import { Module } from '@nestjs/common'

import { AuthService } from '../auth/auth.service'
import { AuthController } from './controllers/auth.controller'

@Module({
  providers: [AuthService],
  controllers: [AuthController],
})
export class HttpModule {}
