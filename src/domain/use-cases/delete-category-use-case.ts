import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { CategoryRepository } from '../repositories/category-repository'
import { ReminderRepository } from '../repositories/reminder-repository'
import { TransactionRepository } from '../repositories/transaction-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceAlreadyExistsError } from './errors/resource-already-exists-error'

interface DeleteCategoryUseCaseRequest {
  userId: string
  categoryId: string
  deleteReminders: boolean
  deleteTransactions: boolean
}

type DeleteCategoryUseCaseResponse = Either<ResourceAlreadyExistsError, unknown>

export class DeleteCategoryUseCase {
  constructor(
    private categoryRepository: CategoryRepository,
    private reminderRepository: ReminderRepository,
    private transactionRepository: TransactionRepository,
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

    if (deleteReminders) {
      await this.reminderRepository.deleteManyByCategoryId(categoryId)
    }
    if (deleteTransactions) {
      await this.transactionRepository.deleteManyBy(categoryId)
    }

    await this.categoryRepository.delete(category)

    return right({})
  }
}