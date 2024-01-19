import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Transfer } from '../../interprise/entities/transfer'
import { AccountRepository } from '../repositories/account-repository'
import { TransferRepository } from '../repositories/transfer-repository'
import { InsufficientBalanceError } from './errors/insufficient-balance-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface NewTransferUseCaseRequest {
  userId: string
  destinyId: string
  referentId: string
  value: number
  description?: string
}

type NewTransferUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | InsufficientBalanceError,
  unknown
>

export class NewTransferUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private transferRepository: TransferRepository,
  ) {}

  async execute({
    userId,
    destinyId,
    referentId,
    value,
    description,
  }: NewTransferUseCaseRequest): Promise<NewTransferUseCaseResponse> {
    const accountDestiny = await this.accountRepository.findById(destinyId)
    const accountReferent = await this.accountRepository.findById(referentId)

    if (!accountDestiny || !accountReferent) {
      return left(new ResourceNotFoundError())
    }

    if (
      accountDestiny.userId.toValue() !== userId ||
      accountReferent.userId.toValue() !== userId
    ) {
      return left(new NotAllowedError())
    }

    if (accountReferent.value < value) {
      return left(new InsufficientBalanceError())
    }

    const transfer = Transfer.crete({
      destinyId: new UniqueEntityId(destinyId),
      referentId: new UniqueEntityId(referentId),
      userId: new UniqueEntityId(userId),
      value,
      description,
    })

    accountReferent.Spent(value)
    accountDestiny.Deposit(value)

    await Promise.all([
      await this.transferRepository.create(transfer),
      await this.accountRepository.save(accountReferent),
      await this.accountRepository.save(accountDestiny),
    ])

    return right({})
  }
}
