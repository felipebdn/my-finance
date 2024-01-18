import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { typeTransaction } from '../entities/transaction'
import { CategoryRepository } from '../repositories/category-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceAlreadyExistsError } from './errors/resource-already-exists-error'

interface EditCategoryUseCaseRequest {
  categoryId: string
  userId: string
  type: string
  name: string
}

type EditCategoryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | ResourceAlreadyExistsError,
  unknown
>

export class EditCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    name,
    type,
    userId,
    categoryId,
  }: EditCategoryUseCaseRequest): Promise<EditCategoryUseCaseResponse> {
    const category = await this.categoryRepository.findById(categoryId)
    if (!category) {
      return left(new ResourceNotFoundError('category'))
    }
    if (category.userId.toValue() !== userId) {
      return left(new NotAllowedError())
    }
    if (category.name === name) {
      return left(new ResourceAlreadyExistsError())
    }

    category.name = name
    category.type = type as typeTransaction
    category.touch()

    await this.categoryRepository.save(category)

    return right({})
  }
}
