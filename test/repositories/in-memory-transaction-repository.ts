import { Transaction } from '@/domain/entities/transaction'
import { TransactionRepository } from '@/domain/repositories/transaction-repository'

export class InMemoryTransactionRepository implements TransactionRepository {
  public transactions: Transaction[] = []

  async create(transaction: Transaction) {
    this.transactions.push(transaction)
  }
}
