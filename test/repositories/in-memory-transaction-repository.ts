import { Transaction } from '@/domain/entities/transaction'
import { TransactionRepository } from '@/domain/repositories/transaction-repository'

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
}
