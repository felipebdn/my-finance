import { makeAccount } from 'test/factories/make-account'
import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { GetResumeUseCase } from './get-resume-accounts-use-case'

let inMemoryAccountRepository: InMemoryAccountRepository
let sut: GetResumeUseCase

describe('Get Resume Accounts', () => {
  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository()
    sut = new GetResumeUseCase(inMemoryAccountRepository)
  })

  it('should be able to get resume of accounts', async () => {
    for (let i = 0; i < 3; i++) {
      const account = makeAccount({
        userId: new UniqueEntityId('user-01'),
        name: `name-${i}`,
        value: 1,
      })
      inMemoryAccountRepository.items.push(account)
    }
    const result = await sut.execute({
      userId: 'user-01',
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.value).toBe(3)
    }
  })

  it('should be able to get resume on account id', async () => {
    for (let i = 0; i < 3; i++) {
      const account = makeAccount(
        {
          userId: new UniqueEntityId('user-01'),
          value: 1 + i,
        },
        new UniqueEntityId(`account-${i + 1}`),
      )
      inMemoryAccountRepository.items.push(account)
    }
    const result1 = await sut.execute({
      userId: 'user-01',
      accountId: 'account-1',
    })
    expect(result1.isRight()).toBeTruthy()
    if (result1.isRight()) {
      expect(result1.value.value).toBe(1)
    }
    const result2 = await sut.execute({
      userId: 'user-01',
      accountId: 'account-2',
    })
    expect(result2.isRight()).toBeTruthy()
    if (result2.isRight()) {
      expect(result2.value.value).toBe(2)
    }
  })
})
