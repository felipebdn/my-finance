import { BetweenDatesParams } from '@/core/repositories/between-dates-params'
import { TransferRepository } from '@/domain/finance/application/repositories/transfer-repository'
import { Transfer } from '@/domain/finance/enterprise/entities/transfer'

import { PrismaTransferMapper } from '../mappers/prisma-transfer-mapper'
import { PrismaService } from '../prisma/prisma.service'

export class PrismaTransferRepository implements TransferRepository {
  constructor(private prisma: PrismaService) {}

  async create(transfer: Transfer) {
    await this.prisma.transfer.create({
      data: PrismaTransferMapper.toPrisma(transfer),
    })
  }

  async delete(transfer: Transfer) {
    await this.prisma.transfer.delete({
      where: {
        id: transfer.id.toValue(),
      },
    })
  }

  async findById(id: string) {
    const transfer = await this.prisma.transfer.findUnique({
      where: {
        id,
      },
    })
    if (!transfer) {
      return null
    }
    return PrismaTransferMapper.toDomain(transfer)
  }

  async findMany(userId: string, ids: string[], params: BetweenDatesParams) {
    const transfers = await this.prisma.transfer.findMany({
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
    return transfers.map((transfer) => PrismaTransferMapper.toDomain(transfer))
  }

  async findManyByAccountId(accountId: string) {
    const transfers = await this.prisma.transfer.findMany({
      where: {
        OR: [{ referentId: accountId }, { destinyId: accountId }],
      },
    })
    return transfers.map((transfer) => PrismaTransferMapper.toDomain(transfer))
  }

  async deleteManyByAccountId(AccountId: string) {
    throw new Error('Method not implemented.')
  }
}
