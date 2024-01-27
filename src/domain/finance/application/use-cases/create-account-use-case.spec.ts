import { makeAccount } from 'test/factories/make-account'
import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository'
import { expect } from 'vitest'

import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'

import { CreateAccountUseCase } from './create-account-use-case'

let inMemoryAccountRepository: InMemoryAccountRepository
let sut: CreateAccountUseCase

describe('Create Account', () => {
  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository()
    sut = new CreateAccountUseCase(inMemoryAccountRepository)
  })

  it('should be able to create a new account', async () => {
    const result = await sut.execute({
      name: 'bank',
      userId: 'user-01',
      value: 1500,
    })
    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAccountRepository.items.length).toBe(1)
    expect(inMemoryAccountRepository.items[0].name).toBe('bank')
  })

  it('should not be able to create a new account, name already exists', async () => {
    const account = makeAccount({
      name: 'bank',
    })
    inMemoryAccountRepository.items.push(account)

    const result = await sut.execute({
      name: 'bank',
      userId: 'user-01',
      value: 1500,
    })
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })
})
