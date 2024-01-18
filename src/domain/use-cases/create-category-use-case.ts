import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Category } from '../entities/category'
import { typeTransaction } from '../entities/transaction'
import { CategoryRepository } from '../repositories/category-repository'
import { ResourceAlreadyExistsError } from './errors/resource-already-exists-error'

interface CreateCategoryUseCaseRequest {
  userId: string
  type: string
  name: string
}

type CreateCategoryUseCaseResponse = Either<ResourceAlreadyExistsError, unknown>

export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    name,
    type,
    userId,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const category = await this.categoryRepository.findByName(name)
    if (category) {
      return left(new ResourceAlreadyExistsError())
    }
    const newCategory = Category.crete({
      name,
      type: type as typeTransaction,
      userId: new UniqueEntityId(userId),
    })

    await this.categoryRepository.create(newCategory)

    return right({})
  }
}
