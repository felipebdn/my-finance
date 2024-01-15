import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Transaction } from '../entities/transaction'
import { TransactionRepository } from '../repositories/transaction-repository'

interface NewTransactionUseCaseRequest {
  accountId: string
  categoryId: string
  userId: string
  type: 'deposit' | 'spent'
  value: number
  description?: string
  date: Date
}
// interface NewTransactionUseCaseResponse {
//   transaction: Transaction
// }

export class NewTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    accountId,
    categoryId,
    date,
    type,
    value,
    description,
    userId,
  }: NewTransactionUseCaseRequest) {
    const transaction = Transaction.crete({
      type,
      value,
      date,
      description,
      userId: new UniqueEntityId(userId),
      accountId: new UniqueEntityId(accountId),
      categoryId: new UniqueEntityId(categoryId),
    })

    await this.transactionRepository.create(transaction)

    return { transaction }
  }
}
