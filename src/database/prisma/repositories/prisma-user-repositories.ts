import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { User } from '@prisma/client'

@Injectable()
export class PrismaUserRepositories {
  constructor(private prisma: PrismaService) {}

  async create(
    name: string,
    email: string,
    coverUrl: string,
    googleId: string,
  ): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        coverUrl,
        googleId,
      },
    })
    return user
  }

  async save(
    id: string,
    name: string,
    email: string,
    coverUrl: string,
    googleId: string,
  ): Promise<User> {
    const user = await this.prisma.user.update({
      data: {
        name,
        email,
        coverUrl,
        googleId,
      },
      where: {
        id,
      },
    })
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }
    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }
    return user
  }
}
