import {
  Transaction,
  typeTransaction,
} from '../../enterprise/entities/transaction'

export abstract class TransactionRepository {
  abstract create(transaction: Transaction): Promise<void>
  abstract save(transaction: Transaction): Promise<void>
  abstract delete(transaction: Transaction): Promise<void>
  abstract deleteManyByCategoryId(categoryId: string): Promise<void>
  abstract deleteManyByAccountId(accountId: string): Promise<void>
  abstract findById(id: string): Promise<Transaction | null>
  abstract findManyByAccountId(accountId: string): Promise<Transaction[]>
  abstract findManyByCategory(
    categoryId: string,
    accountIds: string[],
    type: typeTransaction,
    userId: string,
  ): Promise<Transaction[]>

  abstract findManyByFilter(
    type: typeTransaction,
    userId: string,
    accountId: string,
    inDate: Date,
    outDate: Date,
  ): Promise<Transaction[]>

  abstract findManyByUserId(
    type: typeTransaction,
    userId: string,
    inDate: Date,
    outDate: Date,
  ): Promise<Transaction[]>
}
