import {
  Transaction,
  typeTransaction,
} from '../../interprise/entities/transaction'

export interface TransactionRepository {
  create(transaction: Transaction): Promise<void>
  save(transaction: Transaction): Promise<void>
  delete(transaction: Transaction): Promise<void>
  deleteManyByCategoryId(categoryId: string): Promise<void>
  deleteManyByAccountId(accountId: string): Promise<void>
  findById(id: string): Promise<Transaction | null>
  findManyByAccountId(accountId: string): Promise<Transaction[]>
  findManyByCategory(
    categoryId: string,
    accountIds: string[],
    type: typeTransaction,
    userId: string,
  ): Promise<Transaction[]>
  findManyByFilter(
    type: typeTransaction,
    userId: string,
    accountId: string,
    inDate: Date,
    outDate: Date,
  ): Promise<Transaction[]>
  findManyByUserId(
    type: typeTransaction,
    userId: string,
    inDate: Date,
    outDate: Date,
  ): Promise<Transaction[]>
}
