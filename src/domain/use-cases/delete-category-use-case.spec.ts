import { makeCategory } from 'test/factories/make-category'
import { makeReminder } from 'test/factories/make-reminder'
import { makeTransaction } from 'test/factories/make-transaction'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryReminderRepository } from 'test/repositories/in-memory-reminder-repository'
import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeleteCategoryUseCase } from './delete-category-use-case'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryReminderRepository: InMemoryReminderRepository
let inMemoryTransactionRepository: InMemoryTransactionRepository
let sut: DeleteCategoryUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryReminderRepository = new InMemoryReminderRepository()
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    sut = new DeleteCategoryUseCase(
      inMemoryCategoryRepository,
      inMemoryReminderRepository,
      inMemoryTransactionRepository,
    )
  })

  it('should be able to create a new category', async () => {
    const category = makeCategory({
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryCategoryRepository.items.push(category)
    const reminder = makeReminder({
      userId: new UniqueEntityId('user-01'),
      categoryId: category.id,
    })
    inMemoryReminderRepository.items.push(reminder)
    const transaction = makeTransaction({
      userId: new UniqueEntityId('user-01'),
      categoryId: category.id,
    })
    inMemoryTransactionRepository.items.push(transaction)

    const result = await sut.execute({
      userId: 'user-01',
      categoryId: category.id.toValue(),
      deleteReminders: true,
      deleteTransactions: true,
    })
    expect(result.isRight()).toBeTruthy()
    expect(inMemoryCategoryRepository.items).length(0)
    expect(inMemoryReminderRepository.items).length(0)
    expect(inMemoryTransactionRepository.items).length(0)
  })
})
