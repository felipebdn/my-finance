import {
  Transaction,
  typeTransaction,
} from '../../enterprise/entities/transaction'

export abstract class TransactionRepository {
  abstract create(transaction: Transaction, t?: string): Promise<void>
  abstract save(transaction: Transaction, t?: string): Promise<void>
  abstract delete(transaction: Transaction, t?: string): Promise<void>
  abstract deleteManyByCategoryId(categoryId: string, t?: string): Promise<void>
  abstract deleteManyByAccountId(accountId: string, t?: string): Promise<void>
  abstract findById(id: string, t?: string): Promise<Transaction | null>
  abstract findManyByAccountId(
    accountId: string,
    t?: string,
  ): Promise<Transaction[]>

  abstract findManyByCategory(
    categoryId: string,
    accountIds: string[],
    type: typeTransaction,
    userId: string,
    t?: string,
  ): Promise<Transaction[]>

  abstract findManyByFilter(
    type: typeTransaction,
    userId: string,
    accountId: string,
    inDate: Date,
    outDate: Date,
    t?: string,
  ): Promise<Transaction[]>

  abstract findManyByUserId(
    type: typeTransaction,
    userId: string,
    inDate: Date,
    outDate: Date,
    t?: string,
  ): Promise<Transaction[]>
}
