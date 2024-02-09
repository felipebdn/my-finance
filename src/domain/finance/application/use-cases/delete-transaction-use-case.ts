import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { TransactionRepository } from '../repositories/transaction-repository'

interface DeleteTransactionUseCaseRequest {
  transactionId: string
  userId: string
}
type DeleteTransactionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  unknown
>

@Injectable()
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
