import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'

import { Account } from '../../enterprise/entities/account'
import { AccountRepository } from '../repositories/account-repository'

interface CreateAccountUseCaseRequest {
  name: string
  value: number
  userId: string
}

type CreateAccountUseCaseResponse = Either<ResourceAlreadyExistsError, unknown>

@Injectable()
export class CreateAccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute({
    userId,
    name,
    value,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const account = await this.accountRepository.findByName(name)

    if (account) {
      return left(new ResourceAlreadyExistsError('name'))
    }

    const newAccount = Account.create({
      name,
      userId: new UniqueEntityId(userId),
      value,
    })

    await this.accountRepository.create(newAccount)

    return right({})
  }
}
