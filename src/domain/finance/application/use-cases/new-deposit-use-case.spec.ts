import { makeAccount } from 'test/factories/make-account'
import { makeCategory } from 'test/factories/make-category'
import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { InMemoryTransactionScope } from 'test/transaction/in-memory-transaction-scope'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { NewDepositUseCase } from './new-deposit-use-case'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let inMemoryAccountRepository: InMemoryAccountRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let scope: InMemoryTransactionScope
let sut: NewDepositUseCase

describe('New Deposit', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    inMemoryAccountRepository = new InMemoryAccountRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    scope = new InMemoryTransactionScope()
    sut = new NewDepositUseCase(
      inMemoryTransactionRepository,
      inMemoryAccountRepository,
      inMemoryCategoryRepository,
      scope,
    )
  })

  it('should be able to make a new deposit', async () => {
    const account = makeAccount(
      {
        userId: new UniqueEntityId('user-01'),
      },
      new UniqueEntityId('account-01'),
    )
    inMemoryAccountRepository.items.push(account)

    const category = makeCategory(
      {
        userId: new UniqueEntityId('user-01'),
        type: 'deposit',
      },
      new UniqueEntityId('category-01'),
    )
    inMemoryCategoryRepository.items.push(category)

    const result = await sut.execute({
      accountId: 'account-01',
      categoryId: 'category-01',
      userId: 'user-01',
      value: 58.87,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTransactionRepository.items[0].id).toBeTruthy()
  })

  it('should not be able to make a new deposit, account not found', async () => {
    const result = await sut.execute({
      accountId: 'account-id',
      categoryId: 'category-id',
      userId: 'user-id',
      value: 58.87,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to make a new deposit, unauthorized user', async () => {
    const account = makeAccount(
      {
        userId: new UniqueEntityId('user-id'),
      },
      new UniqueEntityId('account-id'),
    )
    inMemoryAccountRepository.items.push(account)

    const result = await sut.execute({
      accountId: 'account-id',
      categoryId: 'category-id',
      userId: 'user-id-1',
      value: 58.87,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
