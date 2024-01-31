import { randomUUID } from 'crypto'

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Transaction } from '../../enterprise/entities/transaction'
import { AccountRepository } from '../repositories/account-repository'
import { CategoryRepository } from '../repositories/category-repository'
import { TransactionRepository } from '../repositories/transaction-repository'
import { TransactionScope } from '../transaction/transaction-scope'
import { InsufficientBalanceError } from './errors/insufficient-balance-error'

interface NewSpentUseCaseRequest {
  accountId: string
  categoryId: string
  userId: string
  value: number
  description?: string
  date?: Date
}
type NewSpentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | InsufficientBalanceError,
  {
    transaction: Transaction
  }
>

export class NewSpentUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository,
    private categoryRepository: CategoryRepository,
    private t: TransactionScope,
  ) {}

  async execute({
    accountId,
    categoryId,
    date,
    value,
    description,
    userId,
  }: NewSpentUseCaseRequest): Promise<NewSpentUseCaseResponse> {
    const account = await this.accountRepository.findById(accountId)

    if (!account) {
      return left(new ResourceNotFoundError('account'))
    }

    if (account.userId.toValue() !== userId) {
      return left(new NotAllowedError())
    }

    if (account.value < value) {
      return left(new InsufficientBalanceError())
    }

    const category = await this.categoryRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError('category'))
    }

    const transaction = Transaction.crete({
      type: 'spent',
      value,
      date,
      description,
      userId: new UniqueEntityId(userId),
      accountId: new UniqueEntityId(accountId),
      categoryId: new UniqueEntityId(categoryId),
    })

    account.Spent(value)

    const transactionKey = randomUUID()

    await this.t.run(async () => {
      await this.accountRepository.save(account)
      await this.transactionRepository.create(transaction)
    }, transactionKey)

    return right({ transaction })
  }
}
