import { TransactionRepository } from '@/domain/finance/application/repositories/transaction-repository'
import {
  Transaction,
  typeTransaction,
} from '@/domain/finance/enterprise/entities/transaction'

import { PrismaTransactionMapper } from '../mappers/prisma-transaction-mapper'
import { PrismaClientManager, PrismaService } from '../prisma.service'

export class PrismaTransactionRepository implements TransactionRepository {
  constructor(
    private prisma: PrismaService,
    private clientManager: PrismaClientManager,
  ) {}

  private getPrisma(tKey?: string) {
    return tKey ? this.clientManager.getClient(tKey) : this.prisma
  }

  async create(transaction: Transaction, t?: string): Promise<void> {
    const prisma = this.getPrisma(t)
    await prisma.transaction.create({
      data: PrismaTransactionMapper.toPrisma(transaction),
    })
  }

  async save(transaction: Transaction, t?: string): Promise<void> {
    const prisma = this.getPrisma(t)
    await prisma.transaction.update({
      data: PrismaTransactionMapper.toPrisma(transaction),
      where: {
        id: transaction.id.toValue(),
      },
    })
  }

  async delete(transaction: Transaction, t?: string): Promise<void> {
    const prisma = this.getPrisma(t)
    await prisma.transaction.delete({
      where: {
        id: transaction.id.toValue(),
      },
    })
  }

  async deleteManyByCategoryId(categoryId: string, t?: string): Promise<void> {
    const prisma = this.getPrisma(t)
    await prisma.transaction.deleteMany({
      where: {
        categoryId,
      },
    })
  }

  async deleteManyByAccountId(accountId: string, t?: string): Promise<void> {
    const prisma = this.getPrisma(t)
    await prisma.transaction.deleteMany({
      where: {
        accountId,
      },
    })
  }

  async findById(id: string, t?: string): Promise<Transaction> {
    const prisma = this.getPrisma(t)
    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
      },
    })
    if (!transaction) {
      return null
    }
    return PrismaTransactionMapper.toDomain(transaction)
  }

  async findManyByAccountId(
    accountId: string,
    t?: string,
  ): Promise<Transaction[]> {
    const prisma = this.getPrisma(t)
    const transactions = await prisma.transaction.findMany({
      where: {
        accountId,
      },
    })
    return transactions.map(PrismaTransactionMapper.toDomain)
  }

  async findManyByCategory(
    categoryId: string,
    accountIds: string[],
    type: typeTransaction,
    userId: string,
    t?: string,
  ): Promise<Transaction[]> {
    const prisma = this.getPrisma(t)
    const transactions = await prisma.transaction.findMany({
      where: {
        AND: [
          { categoryId },
          {
            accountId: {
              in: accountIds,
            },
          },
          { type },
          { userId },
        ],
      },
    })
    return transactions.map(PrismaTransactionMapper.toDomain)
  }

  async findManyByFilter(
    type: typeTransaction,
    userId: string,
    accountId: string,
    inDate: Date,
    outDate: Date,
    t?: string,
  ): Promise<Transaction[]> {
    const prisma = this.getPrisma(t)
    const transactions = await prisma.transaction.findMany({
      where: {
        AND: [
          { type },
          { userId },
          { accountId },
          {
            date: {
              gte: inDate,
              lte: outDate,
            },
          },
        ],
      },
    })
    return transactions.map(PrismaTransactionMapper.toDomain)
  }

  async findManyByUserId(
    type: typeTransaction,
    userId: string,
    inDate: Date,
    outDate: Date,
    t?: string,
  ): Promise<Transaction[]> {
    const prisma = this.getPrisma(t)
    const transactions = await prisma.transaction.findMany({
      where: {
        AND: [
          { type },
          { userId },
          {
            date: {
              gte: inDate,
              lte: outDate,
            },
          },
        ],
      },
    })
    return transactions.map(PrismaTransactionMapper.toDomain)
  }
}
