import { Either, right } from '@/core/either'

import { Transaction } from '../../interprise/entities/transaction'
import { TransactionRepository } from '../repositories/transaction-repository'

interface ListTransactionWithFilterRequest {
  type: string
  userId: string
  inDate: Date
  outDate: Date
  accountId?: string
}

type ListTransactionWithFilterResponse = Either<
  unknown,
  {
    transactions: Transaction[]
  }
>

export class ListTransactionWithFilter {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    type,
    accountId,
    userId,
    inDate,
    outDate,
  }: ListTransactionWithFilterRequest): Promise<ListTransactionWithFilterResponse> {
    if (accountId) {
      const transactions = await this.transactionRepository.findManyByFilter(
        type as 'deposit' | 'spent',
        userId,
        accountId,
        inDate,
        outDate,
      )

      return right({ transactions })
    }
    const transactions = await this.transactionRepository.findManyByUserId(
      type as 'deposit' | 'spent',
      userId,
      inDate,
      outDate,
    )

    return right({ transactions })
  }
}
