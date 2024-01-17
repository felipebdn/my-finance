import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Account } from '../entities/account'
import { AccountRepository } from '../repositories/account-repository'

interface GetResumeUseCaseRequest {
  userId: string
}

type GetResumeUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    accounts: Account[]
  }
>

export class GetResumeUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute({
    userId,
  }: GetResumeUseCaseRequest): Promise<GetResumeUseCaseResponse> {
    const accounts = await this.accountRepository.findManyByUserId(userId)

    if (!(accounts.length > 0)) {
      return left(new ResourceNotFoundError())
    }

    return right({ accounts })
  }
}
