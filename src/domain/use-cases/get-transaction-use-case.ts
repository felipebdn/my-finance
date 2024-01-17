import { Either, right } from '@/core/either'

import { Account } from '../entities/account'
import { AccountRepository } from '../repositories/account-repository'
import { TransactionRepository } from '../repositories/transaction-repository'

interface GetTransactionUseCaseRequest {
  transactionId: string
}

type GetTransactionUseCaseResponse = Either<
  unknown,
  {
    accounts: Account[]
  }
>

export class GetTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    userId,
  }: GetTransactionUseCaseRequest): Promise<GetTransactionUseCaseResponse> {
    return right({ accounts })
  }
}
