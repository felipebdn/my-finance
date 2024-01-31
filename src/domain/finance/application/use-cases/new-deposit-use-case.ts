import { randomUUID } from 'crypto'

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Transaction } from '../../enterprise/entities/transaction'
import { AccountRepository } from '../repositories/account-repository'
import { TransactionRepository } from '../repositories/transaction-repository'
import { TransactionScope } from '../transaction/transaction-scope'

interface NewDepositUseCaseRequest {
  accountId: string
  categoryId: string
  userId: string
  value: number
  description?: string
  date?: Date
}
type NewDepositUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  unknown
>

export class NewDepositUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository,
    private t: TransactionScope,
  ) {}

  async execute({
    accountId,
    categoryId,
    date,
    value,
    description,
    userId,
  }: NewDepositUseCaseRequest): Promise<NewDepositUseCaseResponse> {
    const account = await this.accountRepository.findById(accountId)

    if (!account) {
      return left(new ResourceNotFoundError('account'))
    }

    if (account.userId.toValue() !== userId) {
      return left(new NotAllowedError())
    }

    const transaction = Transaction.crete({
      type: 'deposit',
      value,
      date,
      description,
      userId: new UniqueEntityId(userId),
      accountId: new UniqueEntityId(accountId),
      categoryId: new UniqueEntityId(categoryId),
    })

    account.Deposit(value)

    const transactionKey = randomUUID()

    await this.t.run(async () => {
      await this.accountRepository.save(account)
      await this.transactionRepository.create(transaction)
    }, transactionKey)

    return right({})
  }
}
