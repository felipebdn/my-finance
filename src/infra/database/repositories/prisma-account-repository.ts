import { Injectable } from '@nestjs/common'

import { AccountRepository } from '@/domain/finance/application/repositories/account-repository'
import { Account } from '@/domain/finance/enterprise/entities/account'

import { PrismaAccountMapper } from '../mappers/prisma-account-mapper'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private prisma: PrismaService) {}

  async create(account: Account) {
    await this.prisma.account.create({
      data: PrismaAccountMapper.toPrisma(account),
    })
  }

  async save(account: Account) {
    await this.prisma.account.update({
      data: PrismaAccountMapper.toPrisma(account),
      where: {
        id: account.id.toValue(),
      },
    })
  }

  async findById(id: string) {
    const account = await this.prisma.account.findUnique({
      where: {
        id,
      },
    })
    if (!account) {
      return null
    }
    return PrismaAccountMapper.toDomain(account)
  }

  async findByName(name: string) {
    const account = await this.prisma.account.findFirst({
      where: {
        name,
      },
    })
    if (!account) {
      return null
    }
    return PrismaAccountMapper.toDomain(account)
  }

  async findManyByUserId(userId: string) {
    const accounts = await this.prisma.account.findMany({
      where: {
        userId,
      },
    })
    return accounts.map(PrismaAccountMapper.toDomain)
  }

  async delete(account: Account) {
    await this.prisma.account.delete({
      where: {
        id: account.id.toValue(),
      },
    })
  }
}
