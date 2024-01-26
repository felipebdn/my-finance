import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { GoogleAuthGuard } from './utils-google/Guards'
import { AuthService } from './auth.service'
import { UserDetails } from '@/@types/user'
import { Public } from './utils-jwt/public'

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/')
  @Public()
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return {
      message: 'login',
    }
  }

  @Get('/google/callback')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() req: Request) {
    const token = await this.authService.signIn(req.user as UserDetails)
    return { message: token }
  }
}
