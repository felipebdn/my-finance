import {
  BadRequestException,
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common'
import { Request } from 'express'

import { UserDetails } from '@/@types/user'
import { AuthenticateUserUseCase } from '@/domain/finance/application/use-cases/authenticate-user-use-case'
import { GoogleAuthGuard } from '@/infra/auth/utils-google/Guards'
import { Public } from '@/infra/auth/utils-jwt/public'

@Controller('/auth')
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

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
    const user = req.user as UserDetails
    const result = await this.authenticateUser.execute({
      avatarUrl: user.coverUrl,
      email: user.email,
      googleId: user.providerId,
      name: user.name,
    })

    if (!result.isRight()) {
      throw new BadRequestException()
    }

    return {
      accessToken: result.value.accessToken,
    }
  }
}
