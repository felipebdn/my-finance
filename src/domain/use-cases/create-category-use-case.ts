import { Either } from '@/core/either'

import { CategoryRepository } from '../repositories/category-repository'
import { ResourceAlreadyExistsError } from './errors/resource-already-exists-error'

interface CreateCategoryUseCaseRequest {}

type CreateCategoryUseCaseResponse = Either<ResourceAlreadyExistsError, unknown>

export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({}: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {}
}
