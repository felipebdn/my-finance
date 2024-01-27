import { makeCategory } from 'test/factories/make-category'
import { makeTransaction } from 'test/factories/make-transaction'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ListTransactionByCategoryUseCase } from './list-transactions-by-category-use-case'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: ListTransactionByCategoryUseCase

describe('List Transactions By Category', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    sut = new ListTransactionByCategoryUseCase(
      inMemoryTransactionRepository,
      inMemoryCategoryRepository,
    )
  })

  it('should be able to list transactions by category', async () => {
    const category1 = makeCategory(
      {
        type: 'deposit',
        userId: new UniqueEntityId('user-01'),
      },
      new UniqueEntityId('category-01'),
    )
    const category2 = makeCategory(
      {
        type: 'deposit',
        userId: new UniqueEntityId('user-01'),
      },
      new UniqueEntityId('category-02'),
    )
    inMemoryCategoryRepository.items.push(category1, category2)

    const transaction1 = makeTransaction({
      userId: new UniqueEntityId('user-01'),
      categoryId: new UniqueEntityId('category-01'),
      type: 'deposit',
      accountId: new UniqueEntityId('account-01'),
    })
    const transaction2 = makeTransaction({
      userId: new UniqueEntityId('user-01'),
      categoryId: new UniqueEntityId('category-02'),
      type: 'deposit',
      accountId: new UniqueEntityId('account-01'),
    })
    const transaction3 = makeTransaction({
      userId: new UniqueEntityId('user-01'),
      categoryId: new UniqueEntityId('category-02'),
      type: 'deposit',
      accountId: new UniqueEntityId('account-01'),
    })
    const transaction4 = makeTransaction({
      userId: new UniqueEntityId('user-01'),
      categoryId: new UniqueEntityId('category-02'),
      type: 'deposit',
      accountId: new UniqueEntityId('account-02'),
    })
    inMemoryTransactionRepository.items.push(
      transaction1,
      transaction2,
      transaction3,
      transaction4,
    )

    const result1 = await sut.execute({
      accounts: ['account-01'],
      categoryId: 'category-02',
      type: 'deposit',
      userId: 'user-01',
    })

    expect(result1.isRight()).toBeTruthy()
    if (result1.isRight()) {
      expect(result1.value.transactions).length(2)
    }

    const result2 = await sut.execute({
      accounts: ['account-01', 'account-02'],
      categoryId: 'category-02',
      type: 'deposit',
      userId: 'user-01',
    })

    expect(result2.isRight()).toBeTruthy()
    if (result2.isRight()) {
      expect(result2.value.transactions).length(3)
    }
  })
})
