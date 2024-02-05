import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'

import { Category } from '../../enterprise/entities/category'
import { typeTransaction } from '../../enterprise/entities/transaction'
import { CategoryRepository } from '../repositories/category-repository'

interface CreateCategoryUseCaseRequest {
  userId: string
  type: string
  name: string
}

type CreateCategoryUseCaseResponse = Either<ResourceAlreadyExistsError, unknown>

@Injectable()
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
    const newCategory = Category.create({
      name,
      type: type as typeTransaction,
      userId: new UniqueEntityId(userId),
    })

    await this.categoryRepository.create(newCategory)

    return right({})
  }
}
