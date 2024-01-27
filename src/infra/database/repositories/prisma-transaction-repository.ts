import { TransactionRepository } from '@/domain/finance/application/repositories/transaction-repository'
import {
  Transaction,
  typeTransaction,
} from '@/domain/finance/enterprise/entities/transaction'

import { PrismaTransactionMapper } from '../mappers/prisma-transaction-mapper'
import { PrismaService } from '../prisma/prisma.service'

export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private prisma: PrismaService) {}

  async create(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.create({
      data: PrismaTransactionMapper.toPrisma(transaction),
    })
  }

  async save(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.update({
      data: PrismaTransactionMapper.toPrisma(transaction),
      where: {
        id: transaction.id.toValue(),
      },
    })
  }

  async delete(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.delete({
      where: {
        id: transaction.id.toValue(),
      },
    })
  }

  async deleteManyByCategoryId(categoryId: string): Promise<void> {
    await this.prisma.transaction.deleteMany({
      where: {
        categoryId,
      },
    })
  }

  async deleteManyByAccountId(accountId: string): Promise<void> {
    await this.prisma.transaction.deleteMany({
      where: {
        accountId,
      },
    })
  }

  async findById(id: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id,
      },
    })
    if (!transaction) {
      return null
    }
    return PrismaTransactionMapper.toDomain(transaction)
  }

  async findManyByAccountId(accountId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        accountId,
      },
    })
    return transactions.map((transaction) =>
      PrismaTransactionMapper.toDomain(transaction),
    )
  }

  async findManyByCategory(
    categoryId: string,
    accountIds: string[],
    type: typeTransaction,
    userId: string,
  ): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        categoryId,
        accountId: {
          in: accountIds,
        },
        type,
        userId,
      },
    })
    return transactions.map((transaction) =>
      PrismaTransactionMapper.toDomain(transaction),
    )
  }

  async findManyByFilter(
    type: typeTransaction,
    userId: string,
    accountId: string,
    inDate: Date,
    outDate: Date,
  ): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        type,
        userId,
        accountId,
        date: {
          gte: inDate,
          lte: outDate,
        },
      },
    })
    return transactions.map((transaction) =>
      PrismaTransactionMapper.toDomain(transaction),
    )
  }

  async findManyByUserId(
    type: typeTransaction,
    userId: string,
    inDate: Date,
    outDate: Date,
  ): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        type,
        userId,
        date: {
          gte: inDate,
          lte: outDate,
        },
      },
    })
    return transactions.map((transaction) =>
      PrismaTransactionMapper.toDomain(transaction),
    )
  }
}
