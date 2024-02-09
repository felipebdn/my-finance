import { randomUUID } from 'node:crypto'

import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { AccountRepository } from '../repositories/account-repository'
import { ReminderRepository } from '../repositories/reminder-repository'
import { TransactionRepository } from '../repositories/transaction-repository'
import { TransferRepository } from '../repositories/transfer-repository'
import { TransactionScope } from '../transaction/transaction-scope'

interface DeleteAccountUseCaseRequest {
  accountId: string
  userId: string
  deleteTransaction?: boolean
  deleteReminder?: boolean
  deleteTransfer?: boolean
}
type DeleteAccountUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  unknown
>
@Injectable()
export class DeleteAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private transactionRepository: TransactionRepository,
    private reminderRepository: ReminderRepository,
    private transferRepository: TransferRepository,
    private t: TransactionScope,
  ) {}

  async execute({
    accountId,
    userId,
    deleteReminder,
    deleteTransaction,
    deleteTransfer,
  }: DeleteAccountUseCaseRequest): Promise<DeleteAccountUseCaseResponse> {
    const account = await this.accountRepository.findById(accountId)

    if (!account) {
      return left(new ResourceNotFoundError('transaction'))
    }

    if (account.userId.toValue() !== userId) {
      return left(new NotAllowedError())
    }

    const transactionKey = randomUUID()

    await this.t.run(async () => {
      deleteReminder &&
        (await this.reminderRepository.deleteManyByAccountId(
          account.id.toValue(),
          transactionKey,
        ))

      deleteTransaction &&
        (await this.transactionRepository.deleteManyByAccountId(
          account.id.toValue(),
          transactionKey,
        ))

      deleteTransfer &&
        (await this.transferRepository.deleteManyByAccountId(
          account.id.toValue(),
          transactionKey,
        ))

      await this.accountRepository.delete(account)
    }, transactionKey)

    return right({})
  }
}
