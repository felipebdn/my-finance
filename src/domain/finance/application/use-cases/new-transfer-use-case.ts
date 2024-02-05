import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Transfer } from '../../enterprise/entities/transfer'
import { AccountRepository } from '../repositories/account-repository'
import { TransferRepository } from '../repositories/transfer-repository'
import { TransactionScope } from '../transaction/transaction-scope'
import { InsufficientBalanceError } from './errors/insufficient-balance-error'

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

@Injectable()
export class NewTransferUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private transferRepository: TransferRepository,
    private t: TransactionScope,
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

    const transfer = Transfer.create({
      destinyId: new UniqueEntityId(destinyId),
      referentId: new UniqueEntityId(referentId),
      userId: new UniqueEntityId(userId),
      value,
      description,
    })

    accountReferent.Spent(value)
    accountDestiny.Deposit(value)

    const transactionKey = randomUUID()

    await this.t.run(async () => {
      await this.transferRepository.create(transfer)
      await this.accountRepository.save(accountReferent)
      await this.accountRepository.save(accountDestiny)
    }, transactionKey)

    return right({})
  }
}
