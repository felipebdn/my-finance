import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Transaction } from '../entities/transaction'
import { TransactionRepository } from '../repositories/transaction-repository'
import { NotAllowedError } from './errors/not-allowed-error'

interface ListTransactionWithFilterRequest {
  type: string
  userId: string
  accountId?: string
}

type ListTransactionWithFilterResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    transaction: Transaction
  }
>

export class ListTransactionWithFilter {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    type,
    accountId,
    userId,
  }: ListTransactionWithFilterRequest): Promise<ListTransactionWithFilterResponse> {}
}
