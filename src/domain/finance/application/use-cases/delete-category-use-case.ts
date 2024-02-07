import { randomUUID } from 'node:crypto'

import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { CategoryRepository } from '../repositories/category-repository'
import { ReminderRepository } from '../repositories/reminder-repository'
import { TransactionRepository } from '../repositories/transaction-repository'
import { TransactionScope } from '../transaction/transaction-scope'

interface DeleteCategoryUseCaseRequest {
  userId: string
  categoryId: string
  deleteReminders: boolean
  deleteTransactions: boolean
}

type DeleteCategoryUseCaseResponse = Either<ResourceAlreadyExistsError, unknown>

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    private categoryRepository: CategoryRepository,
    private reminderRepository: ReminderRepository,
    private transactionRepository: TransactionRepository,
    private t: TransactionScope,
  ) {}

  async execute({
    userId,
    categoryId,
    deleteReminders,
    deleteTransactions,
  }: DeleteCategoryUseCaseRequest): Promise<DeleteCategoryUseCaseResponse> {
    const category = await this.categoryRepository.findById(categoryId)
    if (!category) {
      return left(new ResourceNotFoundError('category'))
    }
    if (category.userId.toValue() !== userId) {
      return left(new NotAllowedError())
    }

    const transactionKey = randomUUID()

    await this.t.run(async () => {
      if (deleteReminders) {
        await this.reminderRepository.deleteManyByCategoryId(
          categoryId,
          transactionKey,
        )
      }
      if (deleteTransactions) {
        await this.transactionRepository.deleteManyByCategoryId(
          categoryId,
          transactionKey,
        )
      }
      await this.categoryRepository.delete(category, transactionKey)
    }, transactionKey)

    return right({})
  }
}
