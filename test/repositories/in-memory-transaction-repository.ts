import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

import { TransactionRepository } from '@/domain/financy/application/repositories/transaction-repository'
import {
  Transaction,
  typeTransaction,
} from '@/domain/financy/interprise/entities/transaction'

dayjs.extend(isBetween)

export class InMemoryTransactionRepository implements TransactionRepository {
  public items: Transaction[] = []

  async create(transaction: Transaction) {
    this.items.push(transaction)
  }

  async save(transaction: Transaction) {
    const index = this.items.findIndex((item) => item.id === transaction.id)
    this.items[index] = transaction
  }

  async delete(transaction: Transaction) {
    const itemIndex = this.items.findIndex((item) => item.id === transaction.id)

    this.items.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const transaction = this.items.find((item) => item.id.toValue() === id)
    if (!transaction) {
      return null
    }
    return transaction
  }

  async findManyByCategory(
    categoryId: string,
    accountIds: string[],
    type: typeTransaction,
    userId: string,
  ) {
    const transactions = this.items
      .filter(
        (item) =>
          item.categoryId.toValue() === categoryId &&
          accountIds.includes(item.accountId.toValue()) &&
          item.type === type &&
          item.userId.toValue() === userId,
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime())

    return transactions
  }

  async findManyByFilter(
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

  async deleteManyByCategoryId(categoryId: string) {
    this.items = this.items.filter(
      (item) => item.categoryId.toValue() !== categoryId,
    )
  }

  async deleteManyByAccountId(accountId: string) {
    const transactions = this.items.filter(
      (item) => item.accountId.toValue() !== accountId,
    )

    this.items = transactions
  }

  async findManyByAccountId(accountId: string) {
    const transactions = this.items.filter(
      (item) => item.accountId.toValue() === accountId,
    )
    return transactions
  }
}
