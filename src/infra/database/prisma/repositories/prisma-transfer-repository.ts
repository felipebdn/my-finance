import { Injectable } from '@nestjs/common'

import { BetweenDatesParams } from '@/core/repositories/between-dates-params'
import { TransferRepository } from '@/domain/finance/application/repositories/transfer-repository'
import { Transfer } from '@/domain/finance/enterprise/entities/transfer'

import { PrismaTransferMapper } from '../mappers/prisma-transfer-mapper'
import { PrismaClientManager, PrismaService } from '../prisma.service'

@Injectable()
export class PrismaTransferRepository implements TransferRepository {
  constructor(
    private prisma: PrismaService,
    private clientManager: PrismaClientManager,
  ) {}

  private getPrisma(tKey?: string) {
    return tKey ? this.clientManager.getClient(tKey) : this.prisma
  }

  async create(transfer: Transfer, t?: string) {
    const prisma = this.getPrisma(t)
    await prisma.transfer.create({
      data: PrismaTransferMapper.toPrisma(transfer),
    })
  }

  async delete(transfer: Transfer, t?: string) {
    const prisma = this.getPrisma(t)
    await prisma.transfer.delete({
      where: {
        id: transfer.id.toValue(),
      },
    })
  }

  async findById(id: string, t?: string) {
    const prisma = this.getPrisma(t)
    const transfer = await prisma.transfer.findUnique({
      where: {
        id,
      },
    })
    if (!transfer) {
      return null
    }
    return PrismaTransferMapper.toDomain(transfer)
  }

  async findMany(
    userId: string,
    ids: string[],
    params: BetweenDatesParams,
    t?: string,
  ) {
    const prisma = this.getPrisma(t)
    const transfers = await prisma.transfer.findMany({
      where: {
        AND: [
          { userId },
          {
            id: {
              in: ids,
            },
          },
          {
            date: {
              lte: params.until,
              gte: params.in,
            },
          },
        ],
      },
    })
    return transfers.map(PrismaTransferMapper.toDomain)
  }

  async findManyByAccountId(accountId: string, t?: string) {
    const prisma = this.getPrisma(t)
    const transfers = await prisma.transfer.findMany({
      where: {
        OR: [{ referentId: accountId }, { destinyId: accountId }],
      },
    })
    return transfers.map(PrismaTransferMapper.toDomain)
  }

  async deleteManyByAccountId(AccountId: string, t?: string) {
    const prisma = this.getPrisma(t)
    await prisma.transfer.deleteMany({
      where: {
        OR: [{ destinyId: AccountId }, { referentId: AccountId }],
      },
    })
  }
}
