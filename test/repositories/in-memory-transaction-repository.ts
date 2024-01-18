import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

import { Transaction } from '@/domain/entities/transaction'
import { TransactionRepository } from '@/domain/repositories/transaction-repository'

dayjs.extend(isBetween)

export class InMemoryTransactionRepository implements TransactionRepository {
  public items: Transaction[] = []

  async findById(id: string) {
    const transaction = this.items.find((item) => item.id.toValue() === id)
    if (!transaction) {
      return null
    }
    return transaction
  }

  async create(transaction: Transaction) {
    this.items.push(transaction)
  }

  async findManyByAccountId(
    type: 'deposit' | 'spent',
    userId: string,
    accountId: string,
    inDate: Date,
    outDate: Date,
  ) {
    const transactions = this.items
      .filter(
        (item) =>
          item.type === type &&
          item.userId.toValue() === userId &&
          item.accountId.toValue() === accountId &&
          dayjs(item.date).isBetween(inDate, dayjs(outDate)),
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime())

    return transactions
  }

  async findManyByUserId(
    type: 'deposit' | 'spent',
    userId: string,
    inDate: Date,
    outDate: Date,
  ) {
    const transactions = this.items
      .filter(
        (item) =>
          item.type === type &&
          item.userId.toValue() === userId &&
          dayjs(item.date).isBetween(inDate, dayjs(outDate)),
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime())

    return transactions
  }
}
