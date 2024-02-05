import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { Transaction } from '../../enterprise/entities/transaction'
import { TransactionRepository } from '../repositories/transaction-repository'

interface ListTransactionWithFilterUserCaseRequest {
  type: string
  userId: string
  inDate: Date
  outDate: Date
  accountId?: string
}

type ListTransactionWithFilterUserCaseResponse = Either<
  unknown,
  {
    transactions: Transaction[]
  }
>

@Injectable()
export class ListTransactionWithFilterUserCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    type,
    accountId,
    userId,
    inDate,
    outDate,
  }: ListTransactionWithFilterUserCaseRequest): Promise<ListTransactionWithFilterUserCaseResponse> {
    if (accountId) {
      const transactions = await this.transactionRepository.findManyByFilter(
        type as 'deposit' | 'spent',
        userId,
        accountId,
        inDate,
        outDate,
      )

      return right({ transactions })
    } else {
      const transactions = await this.transactionRepository.findManyByUserId(
        type as 'deposit' | 'spent',
        userId,
        inDate,
        outDate,
      )

      return right({ transactions })
    }
  }
}
