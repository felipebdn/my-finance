import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Transaction } from '../entities/transaction'
import { TransactionRepository } from '../repositories/transaction-repository'

interface NewDepositUseCaseRequest {
  accountId: string
  categoryId: string
  userId: string
  value: number
  description?: string
  date?: Date
}
interface NewDepositUseCaseResponse {
  transaction: Transaction
}

export class NewDepositUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    accountId,
    categoryId,
    date,
    value,
    description,
    userId,
  }: NewDepositUseCaseRequest): Promise<NewDepositUseCaseResponse> {
    const transaction = Transaction.crete({
      type: 'deposit',
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
