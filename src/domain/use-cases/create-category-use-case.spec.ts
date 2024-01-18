import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { expect } from 'vitest'

import { CreateCategoryUseCase } from './create-category-use-case'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: CreateCategoryUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    sut = new CreateCategoryUseCase(inMemoryCategoryRepository)
  })

  it('should be able to create a new category', async () => {
    const result = await sut.execute({
      name: 'category-01',
      type: 'deposit',
      userId: 'user-01',
    })
    expect(result.isRight()).toBeTruthy()
  })
})
