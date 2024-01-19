import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { AccountRepository } from '../repositories/account-repository'
import { ReminderRepository } from '../repositories/reminder-repository'
import { TransactionRepository } from '../repositories/transaction-repository'
import { TransferRepository } from '../repositories/transfer-repository'
import { NotAllowedError } from './errors/not-allowed-error'

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

export class DeleteAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private transactionRepository: TransactionRepository,
    private reminderRepository: ReminderRepository,
    private transferRepository: TransferRepository,
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

    deleteReminder &&
      (await this.reminderRepository.deleteManyByAccountId(
        account.id.toValue(),
      ))

    deleteTransaction &&
      (await this.transactionRepository.deleteManyByAccountId(
        account.id.toValue(),
      ))

    deleteTransfer &&
      this.transferRepository.deleteManyByAccountId(account.id.toValue())

    await this.accountRepository.delete(account)

    return right({})
  }
}
