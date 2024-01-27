import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { EditCategoryUseCase } from './edit-category-use-case'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: EditCategoryUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    sut = new EditCategoryUseCase(inMemoryCategoryRepository)
  })

  it('should be able to create a new category', async () => {
    const category = makeCategory({
      name: 'name-01',
      type: 'deposit',
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryCategoryRepository.items.push(category)

    const result = await sut.execute({
      categoryId: category.id.toValue(),
      name: 'name-02',
      type: 'spent',
      userId: 'user-01',
    })
    expect(result.isRight()).toBeTruthy()
    expect(inMemoryCategoryRepository.items[0].name).toBe('name-02')
    expect(inMemoryCategoryRepository.items[0].type).toBe('spent')
  })
})
