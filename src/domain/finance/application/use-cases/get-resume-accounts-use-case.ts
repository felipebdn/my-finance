import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { AccountRepository } from '../repositories/account-repository'

interface GetResumeUseCaseRequest {
  userId: string
  accountId?: string
}

type GetResumeUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    value: number
  }
>

export class GetResumeUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute({
    userId,
    accountId,
  }: GetResumeUseCaseRequest): Promise<GetResumeUseCaseResponse> {
    if (accountId) {
      const accounts = await this.accountRepository.findById(accountId)

      if (!accounts) {
        return left(new ResourceNotFoundError('account'))
      }

      return right({ value: accounts.value })
    } else {
      const accounts = await this.accountRepository.findManyByUserId(userId)

      const value: number = accounts.reduce(
        (accumulator, currentValue) => accumulator + currentValue.value,
        0,
      )

      return right({ value })
    }
  }
}
