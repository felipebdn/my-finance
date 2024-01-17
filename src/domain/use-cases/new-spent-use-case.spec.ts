import { makeAccount } from 'test/factories/make-account'
import { makeCategory } from 'test/factories/make-category'
import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { NewSpentUseCase } from './new-spent-use-case'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let inMemoryAccountRepository: InMemoryAccountRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: NewSpentUseCase

describe('New Transaction', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    inMemoryAccountRepository = new InMemoryAccountRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    sut = new NewSpentUseCase(
      inMemoryTransactionRepository,
      inMemoryAccountRepository,
      inMemoryCategoryRepository,
    )
  })

  it('should be able to make a new transaction', async () => {
    const account = makeAccount({
      userId: new UniqueEntityId('user-01'),
      value: 100,
    })
    inMemoryAccountRepository.items.push(account)

    const category = makeCategory({
      type: 'spent',
    })
    inMemoryCategoryRepository.itens.push(category)

    const result = await sut.execute({
      accountId: account.id.toValue(),
      categoryId: category.id.toValue(),
      userId: 'user-01',
      value: 30.5,
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.transaction.id).toBeTruthy()
    }
    expect(inMemoryAccountRepository.items[0].value).toBe(69.5)
  })
})
