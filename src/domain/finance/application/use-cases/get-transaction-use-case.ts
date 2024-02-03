import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Transaction } from '../../enterprise/entities/transaction'
import { TransactionRepository } from '../repositories/transaction-repository'

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

@Injectable()
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
