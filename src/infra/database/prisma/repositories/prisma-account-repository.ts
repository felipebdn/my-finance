import { Injectable } from '@nestjs/common'

import { AccountRepository } from '@/domain/finance/application/repositories/account-repository'
import { Account } from '@/domain/finance/enterprise/entities/account'

import { PrismaAccountMapper } from '../mappers/prisma-account-mapper'
import { PrismaClientManager, PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(
    private prisma: PrismaService,
    private clientManager: PrismaClientManager,
  ) {}

  private getPrisma(tKey?: string) {
    return tKey ? this.clientManager.getClient(tKey) : this.prisma
  }

  async create(account: Account, t?: string) {
    const prisma = this.getPrisma(t)
    await prisma.account.create({
      data: PrismaAccountMapper.toPrisma(account),
    })
  }

  async save(account: Account, t?: string) {
    const prisma = this.getPrisma(t)
    await prisma.account.update({
      data: PrismaAccountMapper.toPrisma(account),
      where: {
        id: account.id.toValue(),
      },
    })
  }

  async findById(id: string, t?: string) {
    const prisma = this.getPrisma(t)
    const account = await prisma.account.findUnique({
      where: {
        id,
      },
    })
    if (!account) {
      return null
    }
    return PrismaAccountMapper.toDomain(account)
  }

  async findByName(name: string, t?: string) {
    const prisma = this.getPrisma(t)
    const account = await prisma.account.findFirst({
      where: {
        name,
      },
    })
    if (!account) {
      return null
    }
    return PrismaAccountMapper.toDomain(account)
  }

  async findManyByUserId(userId: string, t?: string) {
    const prisma = this.getPrisma(t)
    const accounts = await prisma.account.findMany({
      where: {
        userId,
      },
    })

    return accounts.map(PrismaAccountMapper.toDomain)
  }

  async delete(account: Account, t?: string) {
    const prisma = this.getPrisma(t)
    await prisma.account.delete({
      where: {
        id: account.id.toValue(),
      },
    })
  }
}
