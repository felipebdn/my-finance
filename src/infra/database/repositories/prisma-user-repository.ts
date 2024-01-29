import { Injectable } from '@nestjs/common'

import { UserRepository } from '@/domain/finance/application/repositories/user-repository'
import { User } from '@/domain/finance/enterprise/entities/user'

import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User) {
    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })
  }

  async save(user: User) {
    await this.prisma.user.update({
      data: PrismaUserMapper.toPrisma(user),
      where: {
        id: user.id.toValue(),
      },
    })
  }

  async delete(user: User) {
    await this.prisma.user.delete({
      where: {
        id: user.id.toValue(),
      },
    })
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })
    if (!user) {
      return null
    }
    return PrismaUserMapper.toDomain(user)
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })
    if (!user) {
      return null
    }
    return PrismaUserMapper.toDomain(user)
  }
}
