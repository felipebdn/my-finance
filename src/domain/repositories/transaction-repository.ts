import { Transaction } from '../entities/transaction'

export interface TransactionRepository {
  create(transaction: Transaction): Promise<void>
  save(transaction: Transaction): Promise<void>
  delete(transaction: Transaction): Promise<void>
  deleteManyBy(categoryId: string): Promise<void>
  findById(id: string): Promise<Transaction | null>
  findManyByAccountId(
    type: 'deposit' | 'spent',
    userId: string,
    accountId: string,
    inDate: Date,
    outDate: Date,
  ): Promise<Transaction[]>
  findManyByUserId(
    type: 'deposit' | 'spent',
    userId: string,
    inDate: Date,
    outDate: Date,
  ): Promise<Transaction[]>
}
