import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Transaction } from '../../interprise/entities/transaction'
import { TransactionRepository } from '../repositories/transaction-repository'
import { NotAllowedError } from './errors/not-allowed-error'

interface GetTransactionUseCaseRequest {
  transactionId: string
  userId: string
}

type GetTransactionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    transaction: Transaction
  }
>

export class GetTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    transactionId,
    userId,
  }: GetTransactionUseCaseRequest): Promise<GetTransactionUseCaseResponse> {
    const transaction = await this.transactionRepository.findById(transactionId)

    if (!transaction) {
      return left(new ResourceNotFoundError('transaction'))
    }

    if (transaction.userId.toValue() !== userId) {
      return left(new NotAllowedError())
    }

    return right({ transaction })
  }
}
