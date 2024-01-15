import { Transaction } from '../entities/transaction'

export interface TransactionRepository {
  create(transaction: Transaction): Promise<Transaction>
}
