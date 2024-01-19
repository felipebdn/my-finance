import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Transaction, typeTransaction } from '../../interprise/entities/transaction'
import { AccountRepository } from '../repositories/account-repository'
import { CategoryRepository } from '../repositories/category-repository'
import { TransactionRepository } from '../repositories/transaction-repository'
import { InsufficientBalanceError } from './errors/insufficient-balance-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface EditTransactionUseCaseRequest {
  transactionId: string
  accountId: string
  categoryId: string
  userId: string
  value: number
  description?: string
  date: Date
  type: typeTransaction
}
type EditTransactionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | InsufficientBalanceError,
  {
    transaction: Transaction
  }
>

export class EditTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async execute({
    transactionId,
    accountId,
    categoryId,
    date,
    value,
    description,
    userId,
    type,
  }: EditTransactionUseCaseRequest): Promise<EditTransactionUseCaseResponse> {
    const transaction = await this.transactionRepository.findById(transactionId)
    if (!transaction) {
      return left(new ResourceNotFoundError('transaction'))
    }

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
    const previousAccount = await this.accountRepository.findById(
      transaction.accountId.toValue(),
    )
    if (!previousAccount) {
      return left(new ResourceNotFoundError('account'))
    }

    switch (true) {
      case previousAccount.id.toValue() !== accountId:
        if (type === 'deposit') {
          account.Deposit(value)
          if (transaction.type === 'spent') {
            previousAccount.Deposit(transaction.value)
          } else {
            previousAccount.Spent(transaction.value)
          }
        } else if (type === 'spent') {
          account.Spent(value)
          if (transaction.type === 'spent') {
            previousAccount.Deposit(transaction.value)
          } else {
            previousAccount.Spent(transaction.value)
          }
        }
        break

      case type === 'deposit':
        if (transaction.type === 'deposit') {
          account.Spent(transaction.value)
          account.Deposit(value)
        } else if (transaction.type === 'spent') {
          account.Deposit(transaction.value)
          account.Deposit(value)
        }
        break

      case type === 'spent':
        if (transaction.type === 'deposit') {
          account.Spent(transaction.value)
          account.Spent(value)
        } else {
          account.Deposit(transaction.value)
          account.Spent(value)
        }
        break

      default:
        break
    }

    transaction.accountId = account.id
    transaction.categoryId = category.id
    transaction.date = date
    transaction.description = description
    transaction.type = type
    transaction.value = value

    transaction.touch()

    await this.accountRepository.save(previousAccount)
    await this.accountRepository.save(account)
    await this.transactionRepository.save(transaction)

    return right({ transaction })
  }
}
