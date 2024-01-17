import { makeAccount } from 'test/factories/make-account'
import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { GetResumeUseCase } from './get-resume-accounts-use-case'

let inMemoryAccountRepository: InMemoryAccountRepository
let sut: GetResumeUseCase

describe('New Transaction', () => {
  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository()
    sut = new GetResumeUseCase(inMemoryAccountRepository)
  })

  it('should be able to make a new transaction', async () => {
    for (let i = 0; i < 3; i++) {
      const account = makeAccount({
        userId: new UniqueEntityId('user-01'),
        name: `name-${i}`,
        value: 10.5,
      })
      inMemoryAccountRepository.items.push(account)
    }
    const result = await sut.execute({
      userId: 'user-01',
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.accounts[0].value).toBe(10.5)
      expect(result.value.accounts[1].value).toBe(10.5)
      expect(result.value.accounts[2].value).toBe(10.5)
    }
  })
})
