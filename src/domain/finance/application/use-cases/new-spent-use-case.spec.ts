import { makeAccount } from 'test/factories/make-account'
import { makeCategory } from 'test/factories/make-category'
import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { InMemoryTransactionScope } from 'test/transaction/in-memory-transaction-scope'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { InsufficientBalanceError } from './errors/insufficient-balance-error'
import { NewSpentUseCase } from './new-spent-use-case'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let inMemoryAccountRepository: InMemoryAccountRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let scope: InMemoryTransactionScope
let sut: NewSpentUseCase

describe('New Spent', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    inMemoryAccountRepository = new InMemoryAccountRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    scope = new InMemoryTransactionScope()
    sut = new NewSpentUseCase(
      inMemoryTransactionRepository,
      inMemoryAccountRepository,
      inMemoryCategoryRepository,
      scope,
    )
  })

  it('should be able to make a new spent', async () => {
    const account = makeAccount({
      userId: new UniqueEntityId('user-01'),
      value: 100,
    })
    inMemoryAccountRepository.items.push(account)

    const category = makeCategory({
      type: 'spent',
    })
    inMemoryCategoryRepository.items.push(category)

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
  it('should not be able to make a new spent, account not found', async () => {
    const account = makeAccount({
      userId: new UniqueEntityId('user-01'),
      value: 100,
    })

    const result = await sut.execute({
      accountId: account.id.toValue(),
      categoryId: 'category.id',
      userId: 'user-01',
      value: 30.5,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not be able to make a new spent, unauthorized user', async () => {
    const account = makeAccount({
      userId: new UniqueEntityId('user-01'),
      value: 100,
    })
    inMemoryAccountRepository.items.push(account)

    const category = makeCategory({
      type: 'spent',
    })
    inMemoryCategoryRepository.items.push(category)

    const result = await sut.execute({
      accountId: account.id.toValue(),
      categoryId: category.id.toValue(),
      userId: 'user-02',
      value: 30.5,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
  it('should not be able to make a new spent, insufficient balance', async () => {
    const account = makeAccount({
      userId: new UniqueEntityId('user-01'),
      value: 30,
    })
    inMemoryAccountRepository.items.push(account)

    const category = makeCategory({
      type: 'spent',
    })
    inMemoryCategoryRepository.items.push(category)

    const result = await sut.execute({
      accountId: account.id.toValue(),
      categoryId: category.id.toValue(),
      userId: 'user-01',
      value: 30.5,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InsufficientBalanceError)
  })
  it('should not be able to make a new spent, category not found', async () => {
    const account = makeAccount({
      userId: new UniqueEntityId('user-01'),
      value: 100,
    })
    inMemoryAccountRepository.items.push(account)

    const category = makeCategory({
      type: 'spent',
    })

    const result = await sut.execute({
      accountId: account.id.toValue(),
      categoryId: category.id.toValue(),
      userId: 'user-01',
      value: 30.5,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
