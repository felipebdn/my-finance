import { makeAccount } from 'test/factories/make-account'
import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { EditAccountUseCase } from './edit-account-use-case'

let inMemoryAccountRepository: InMemoryAccountRepository
let sut: EditAccountUseCase

describe('Edit Account', () => {
  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository()
    sut = new EditAccountUseCase(inMemoryAccountRepository)
  })

  it('should be able to edit account', async () => {
    const account = makeAccount({
      name: 'example name',
      value: 100,
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryAccountRepository.items.push(account)
    const result = await sut.execute({
      accountId: account.id.toValue(),
      userId: 'user-01',
      name: 'name changed',
      value: 150,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAccountRepository.items.length).toBe(1)
    expect(inMemoryAccountRepository.items[0].name).toBe('name changed')
    expect(inMemoryAccountRepository.items[0].value).toBe(150)
  })

  it('should not be able to create a new account, not authorized', async () => {
    const account = makeAccount({
      name: 'example name',
      value: 100,
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryAccountRepository.items.push(account)
    const result = await sut.execute({
      accountId: account.id.toValue(),
      userId: 'user-02',
      name: 'name changed',
      value: 150,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to create a new account, not authorized', async () => {
    const result = await sut.execute({
      accountId: 'account-01',
      userId: 'user-02',
      name: 'name changed',
      value: 150,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
