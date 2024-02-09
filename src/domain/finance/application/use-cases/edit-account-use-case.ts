import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { AccountRepository } from '../repositories/account-repository'

interface EditAccountUseCaseRequest {
  accountId: string
  userId: string
  name: string
  value: number
}

type EditAccountUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  unknown
>

@Injectable()
export class EditAccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute({
    accountId,
    userId,
    name,
    value,
  }: EditAccountUseCaseRequest): Promise<EditAccountUseCaseResponse> {
    const account = await this.accountRepository.findById(accountId)

    if (!account) {
      return left(new ResourceNotFoundError('account'))
    }
    if (account.userId.toValue() !== userId) {
      return left(new NotAllowedError())
    }

    account.name = name
    account.value = value

    await this.accountRepository.save(account)

    return right({})
  }
}
