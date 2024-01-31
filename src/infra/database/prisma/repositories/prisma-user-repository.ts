import { Injectable } from '@nestjs/common'

import { UserRepository } from '@/domain/finance/application/repositories/user-repository'
import { User } from '@/domain/finance/enterprise/entities/user'

import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { PrismaClientManager, PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    private prisma: PrismaService,
    private clientManager: PrismaClientManager,
  ) {}

  private getPrisma(tKey?: string) {
    return tKey ? this.clientManager.getClient(tKey) : this.prisma
  }

  async create(user: User, t?: string) {
    const prisma = this.getPrisma(t)
    await prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })
  }

  async save(user: User, t?: string) {
    const prisma = this.getPrisma(t)
    await prisma.user.update({
      data: PrismaUserMapper.toPrisma(user),
      where: {
        id: user.id.toValue(),
      },
    })
  }

  async delete(user: User, t?: string) {
    const prisma = this.getPrisma(t)
    await prisma.user.delete({
      where: {
        id: user.id.toValue(),
      },
    })
  }

  async findById(id: string, t?: string) {
    const prisma = this.getPrisma(t)
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    if (!user) {
      return null
    }
    return PrismaUserMapper.toDomain(user)
  }

  async findByEmail(email: string, t?: string) {
    const prisma = this.getPrisma(t)
    const user = await prisma.user.findFirst({
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
