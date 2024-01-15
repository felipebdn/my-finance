import { Transaction } from '../entities/transaction'
import { TransactionRepository } from '../repositories/transaction-repository'
interface NewTransactionUseCaseRequest {
  type: 'deposit' | 'spent'
  value: number
  accountId: string
  categoryId: string
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
  }: NewTransactionUseCaseRequest) {
    const transaction = new Transaction({
      type,
      value,
      date,
      description,
    })

    await this.transactionRepository.create(transaction)

    return { transaction }
  }
}
