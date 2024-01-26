import { makeAccount } from 'test/factories/make-account'
import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository'
import { InMemoryTransferRepository } from 'test/repositories/in-memory-transfer-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { NewTransferUseCase } from './new-transfer-use-case'

let inMemoryAccountRepository: InMemoryAccountRepository
let inMemoryTransferRepository: InMemoryTransferRepository
let sut: NewTransferUseCase

describe('New Transfer', () => {
  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository()
    inMemoryTransferRepository = new InMemoryTransferRepository()
    sut = new NewTransferUseCase(
      inMemoryAccountRepository,
      inMemoryTransferRepository,
    )
  })

  it('should be able to make new transfer', async () => {
    const accountReferent = makeAccount({
      userId: new UniqueEntityId('user-01'),
      value: 100.95,
    })
    const accountDestiny = makeAccount({
      userId: new UniqueEntityId('user-01'),
      value: 0,
    })
    inMemoryAccountRepository.items.push(accountReferent, accountDestiny)

    const result = await sut.execute({
      destinyId: accountDestiny.id.toValue(),
      referentId: accountReferent.id.toValue(),
      userId: 'user-01',
      value: 40,
      description: 'description of test',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAccountRepository.items[0].value).toBe(60.95)
  })
})
