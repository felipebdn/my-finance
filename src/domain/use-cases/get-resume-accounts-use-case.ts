import { Either, right } from '@/core/either'

import { Account } from '../entities/account'
import { AccountRepository } from '../repositories/account-repository'

interface GetResumeUseCaseRequest {
  userId: string
}

type GetResumeUseCaseResponse = Either<
  unknown,
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

    return right({ accounts })
  }
}
