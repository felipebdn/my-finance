import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { randomUUID } from 'crypto'

import { UserDetails } from '@/@types/user'
import { PrismaService } from '@/database/prisma/prisma.service'

interface GenerateJwtProps {
  sub: string
  email: string
}

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  private generateJwt(payload: GenerateJwtProps) {
    return this.jwt.sign(payload)
  }

  async signIn(user: UserDetails) {
    return this.generateJwt({
      sub: randomUUID(),
      email: user.email,
    })
  }
}
