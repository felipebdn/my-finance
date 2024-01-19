import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { TransactionRepository } from '../repositories/transaction-repository'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteTransactionUseCaseRequest {
  transactionId: string
  userId: string
}
type DeleteTransactionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  unknown
>

export class DeleteTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    transactionId,
    userId,
  }: DeleteTransactionUseCaseRequest): Promise<DeleteTransactionUseCaseResponse> {
    const transaction = await this.transactionRepository.findById(transactionId)

    if (!transaction) {
      return left(new ResourceNotFoundError('transaction'))
    }

    if (transaction.userId.toValue() !== userId) {
      return left(new NotAllowedError())
    }

    await this.transactionRepository.delete(transaction)

    return right({})
  }
}
