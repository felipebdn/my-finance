import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import {
  Transaction,
  typeTransaction,
} from '../../enterprise/entities/transaction'
import { CategoryRepository } from '../repositories/category-repository'
import { TransactionRepository } from '../repositories/transaction-repository'

interface ListTransactionByCategoryUseCaseRequest {
  userId: string
  accounts: string[]
  type: typeTransaction
  categoryId: string
}

type ListTransactionByCategoryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { transactions: Transaction[] }
>

@Injectable()
export class ListTransactionByCategoryUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async execute({
    type,
    userId,
    accounts,
    categoryId,
  }: ListTransactionByCategoryUseCaseRequest): Promise<ListTransactionByCategoryUseCaseResponse> {
    const category = await this.categoryRepository.findById(categoryId)
    if (!category) {
      return left(new ResourceNotFoundError('category'))
    }
    if (category.userId.toValue() !== userId) {
      return left(new NotAllowedError())
    }

    const transactions = await this.transactionRepository.findManyByCategory(
      categoryId,
      accounts,
      type,
      userId,
    )

    return right({ transactions })
  }
}
