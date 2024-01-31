import { makeAccount } from 'test/factories/make-account'
import { makeCategory } from 'test/factories/make-category'
import { makeTransaction } from 'test/factories/make-transaction'
import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { InMemoryTransactionScope } from 'test/transaction/in-memory-transaction-scope'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { EditTransactionUseCase } from './edit-transaction-use-case'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let inMemoryAccountRepository: InMemoryAccountRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let scope: InMemoryTransactionScope
let sut: EditTransactionUseCase

describe('Edit Deposit', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    inMemoryAccountRepository = new InMemoryAccountRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    scope = new InMemoryTransactionScope()
    sut = new EditTransactionUseCase(
      inMemoryTransactionRepository,
      inMemoryAccountRepository,
      inMemoryCategoryRepository,
      scope,
    )
  })

  it('should be able to edit a deposit, different accounts', async () => {
    const accountPrevious = makeAccount({
      userId: new UniqueEntityId('user-01'),
      name: 'previous',
      value: 100,
    })
    const accountNow = makeAccount({
      userId: new UniqueEntityId('user-01'),
      name: 'now',
      value: 200,
    })
    inMemoryAccountRepository.items.push(accountPrevious, accountNow)

    const categoryPrevious = makeCategory({
      type: 'deposit',
      userId: new UniqueEntityId('user-01'),
    })
    const categoryNow = makeCategory({
      type: 'spent',
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryCategoryRepository.items.push(categoryPrevious, categoryNow)

    const transaction = makeTransaction({
      accountId: accountPrevious.id,
      categoryId: categoryPrevious.id,
      type: 'deposit',
      value: 50,
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryTransactionRepository.items.push(transaction)

    const result = await sut.execute({
      accountId: accountNow.id.toValue(),
      categoryId: categoryNow.id.toValue(),
      date: new Date(),
      transactionId: transaction.id.toValue(),
      type: 'spent',
      userId: 'user-01',
      value: 60,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAccountRepository.items[0].value).toBe(50)
    expect(inMemoryAccountRepository.items[1].value).toBe(140)
  })

  it('should be able to edit a deposit, different accounts', async () => {
    const accountPrevious = makeAccount({
      userId: new UniqueEntityId('user-01'),
      name: 'previous',
      value: 100,
    })
    const accountNow = makeAccount({
      userId: new UniqueEntityId('user-01'),
      name: 'now',
      value: 200,
    })
    inMemoryAccountRepository.items.push(accountPrevious, accountNow)

    const categoryPrevious = makeCategory({
      type: 'deposit',
      userId: new UniqueEntityId('user-01'),
    })
    const categoryNow = makeCategory({
      type: 'spent',
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryCategoryRepository.items.push(categoryPrevious, categoryNow)

    const transaction = makeTransaction({
      accountId: accountPrevious.id,
      categoryId: categoryPrevious.id,
      type: 'deposit',
      value: 50,
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryTransactionRepository.items.push(transaction)

    const result = await sut.execute({
      accountId: accountNow.id.toValue(),
      categoryId: categoryPrevious.id.toValue(),
      date: new Date(),
      transactionId: transaction.id.toValue(),
      type: 'deposit',
      userId: 'user-01',
      value: 60,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAccountRepository.items[0].value).toBe(50)
    expect(inMemoryAccountRepository.items[1].value).toBe(260)
  })

  it('should be able to edit a deposit, different accounts', async () => {
    const accountPrevious = makeAccount({
      userId: new UniqueEntityId('user-01'),
      name: 'previous',
      value: 100,
    })
    const accountNow = makeAccount({
      userId: new UniqueEntityId('user-01'),
      name: 'now',
      value: 200,
    })
    inMemoryAccountRepository.items.push(accountPrevious, accountNow)

    const categoryPrevious = makeCategory({
      type: 'deposit',
      userId: new UniqueEntityId('user-01'),
    })
    const categoryNow = makeCategory({
      type: 'spent',
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryCategoryRepository.items.push(categoryPrevious, categoryNow)

    const transaction = makeTransaction({
      accountId: accountPrevious.id,
      categoryId: categoryPrevious.id,
      type: 'spent',
      value: 50,
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryTransactionRepository.items.push(transaction)

    const result = await sut.execute({
      accountId: accountNow.id.toValue(),
      categoryId: categoryNow.id.toValue(),
      date: new Date(),
      transactionId: transaction.id.toValue(),
      type: 'deposit',
      userId: 'user-01',
      value: 60,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAccountRepository.items[0].value).toBe(150)
    expect(inMemoryAccountRepository.items[1].value).toBe(260)
  })

  it('should be able to edit a deposit, different accounts', async () => {
    const accountPrevious = makeAccount({
      userId: new UniqueEntityId('user-01'),
      name: 'previous',
      value: 100,
    })
    const accountNow = makeAccount({
      userId: new UniqueEntityId('user-01'),
      name: 'now',
      value: 200,
    })
    inMemoryAccountRepository.items.push(accountPrevious, accountNow)

    const categoryPrevious = makeCategory({
      type: 'deposit',
      userId: new UniqueEntityId('user-01'),
    })
    const categoryNow = makeCategory({
      type: 'spent',
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryCategoryRepository.items.push(categoryPrevious, categoryNow)

    const transaction = makeTransaction({
      accountId: accountPrevious.id,
      categoryId: categoryPrevious.id,
      type: 'spent',
      value: 50,
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryTransactionRepository.items.push(transaction)

    const result = await sut.execute({
      accountId: accountNow.id.toValue(),
      categoryId: categoryNow.id.toValue(),
      date: new Date(),
      transactionId: transaction.id.toValue(),
      type: 'spent',
      userId: 'user-01',
      value: 60,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAccountRepository.items[0].value).toBe(150)
    expect(inMemoryAccountRepository.items[1].value).toBe(140)
  })

  it('should be able to edit a deposit, same accounts, deposit / deposit', async () => {
    const accountPrevious = makeAccount({
      userId: new UniqueEntityId('user-01'),
      name: 'previous',
      value: 100,
    })
    inMemoryAccountRepository.items.push(accountPrevious)

    const categoryPrevious = makeCategory({
      type: 'deposit',
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryCategoryRepository.items.push(categoryPrevious)

    const transaction = makeTransaction({
      accountId: accountPrevious.id,
      categoryId: categoryPrevious.id,
      type: 'deposit',
      value: 50,
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryTransactionRepository.items.push(transaction)

    const result = await sut.execute({
      accountId: accountPrevious.id.toValue(),
      categoryId: categoryPrevious.id.toValue(),
      date: new Date(),
      transactionId: transaction.id.toValue(),
      type: 'deposit',
      userId: 'user-01',
      value: 60,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAccountRepository.items[0].value).toBe(110)
  })

  it('should be able to edit a deposit, same accounts, deposit / spent', async () => {
    const accountPrevious = makeAccount({
      userId: new UniqueEntityId('user-01'),
      name: 'previous',
      value: 100,
    })
    inMemoryAccountRepository.items.push(accountPrevious)

    const categoryPrevious = makeCategory({
      type: 'deposit',
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryCategoryRepository.items.push(categoryPrevious)

    const transaction = makeTransaction({
      accountId: accountPrevious.id,
      categoryId: categoryPrevious.id,
      type: 'deposit',
      value: 50,
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryTransactionRepository.items.push(transaction)

    const result = await sut.execute({
      accountId: accountPrevious.id.toValue(),
      categoryId: categoryPrevious.id.toValue(),
      date: new Date(),
      transactionId: transaction.id.toValue(),
      type: 'spent',
      userId: 'user-01',
      value: 40,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAccountRepository.items[0].value).toBe(10)
  })

  it('should be able to edit a deposit, same accounts, spent / spent', async () => {
    const accountPrevious = makeAccount({
      userId: new UniqueEntityId('user-01'),
      name: 'previous',
      value: 100,
    })
    inMemoryAccountRepository.items.push(accountPrevious)

    const categoryPrevious = makeCategory({
      type: 'deposit',
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryCategoryRepository.items.push(categoryPrevious)

    const transaction = makeTransaction({
      accountId: accountPrevious.id,
      categoryId: categoryPrevious.id,
      type: 'spent',
      value: 50,
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryTransactionRepository.items.push(transaction)

    const result = await sut.execute({
      accountId: accountPrevious.id.toValue(),
      categoryId: categoryPrevious.id.toValue(),
      date: new Date(),
      transactionId: transaction.id.toValue(),
      type: 'spent',
      userId: 'user-01',
      value: 40,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAccountRepository.items[0].value).toBe(110)
  })

  it('should be able to edit a deposit, same accounts, spent / deposit', async () => {
    const accountPrevious = makeAccount({
      userId: new UniqueEntityId('user-01'),
      name: 'previous',
      value: 100,
    })
    inMemoryAccountRepository.items.push(accountPrevious)

    const categoryPrevious = makeCategory({
      type: 'deposit',
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryCategoryRepository.items.push(categoryPrevious)

    const transaction = makeTransaction({
      accountId: accountPrevious.id,
      categoryId: categoryPrevious.id,
      type: 'spent',
      value: 50,
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryTransactionRepository.items.push(transaction)

    const result = await sut.execute({
      accountId: accountPrevious.id.toValue(),
      categoryId: categoryPrevious.id.toValue(),
      date: new Date(),
      transactionId: transaction.id.toValue(),
      type: 'deposit',
      userId: 'user-01',
      value: 40,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAccountRepository.items[0].value).toBe(190)
  })
})
