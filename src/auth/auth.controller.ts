import { Controller, Get, UseGuards } from '@nestjs/common'
import { GoogleAuthGuard } from './utils/Guards'

@Controller('/auth')
export class AuthController {
  @Get('/')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return {
      message: 'login',
    }
  }

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  handleCallback() {
    return {
      message: 'ok',
    }
  }
}
