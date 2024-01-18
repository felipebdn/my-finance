import { Transaction } from '../entities/transaction'

export interface TransactionRepository {
  create(transaction: Transaction): Promise<void>
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
