import { AppService } from 'src/app.service'
import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { GoogleOAuthGuard } from 'src/auth/google-oauth.guard'

@Controller('/auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('/google/callback')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.appService.googleLogin(req)
  }
}
