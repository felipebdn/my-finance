import { makeCategory } from 'test/factories/make-category'
import { makeReminder } from 'test/factories/make-reminder'
import { makeTransaction } from 'test/factories/make-transaction'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryReminderRepository } from 'test/repositories/in-memory-reminder-repository'
import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { InMemoryTransactionScope } from 'test/transaction/in-memory-transaction-scope'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeleteCategoryUseCase } from './delete-category-use-case'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryReminderRepository: InMemoryReminderRepository
let inMemoryTransactionRepository: InMemoryTransactionRepository
let scope: InMemoryTransactionScope
let sut: DeleteCategoryUseCase

describe('Delete Category', () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryReminderRepository = new InMemoryReminderRepository()
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    scope = new InMemoryTransactionScope()
    sut = new DeleteCategoryUseCase(
      inMemoryCategoryRepository,
      inMemoryReminderRepository,
      inMemoryTransactionRepository,
      scope,
    )
  })

  it('should be able to delete a category and others entities that depend on the category', async () => {
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

  it('should be able to delete a category and without deleting entities that depended on the category', async () => {
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
      deleteReminders: false,
      deleteTransactions: false,
    })
    expect(result.isRight()).toBeTruthy()
    expect(inMemoryCategoryRepository.items).length(0)
    expect(inMemoryReminderRepository.items).length(1)
    expect(inMemoryTransactionRepository.items).length(1)
  })
})
