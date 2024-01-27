import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'

import { UserDetails } from '@/@types/user'
import { AuthService } from '@/infra/auth/auth.service'
import { GoogleAuthGuard } from '@/infra/auth/utils-google/Guards'
import { Public } from '@/infra/auth/utils-google/utils-jwt/public'

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
