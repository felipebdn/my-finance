import { makeTransaction } from 'test/factories/make-transaction'
import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { GetTransactionUseCase } from './get-transaction-use-case'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let sut: GetTransactionUseCase

describe('Get Transaction', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    sut = new GetTransactionUseCase(inMemoryTransactionRepository)
  })

  it('should be able to get a transaction by id', async () => {
    const transaction = makeTransaction(
      {
        userId: new UniqueEntityId('user-01'),
      },
      new UniqueEntityId('transaction-01'),
    )
    inMemoryTransactionRepository.items.push(transaction)

    const result = await sut.execute({
      transactionId: 'transaction-01',
      userId: 'user-01',
    })
    expect(result.isRight()).toBeTruthy()
  })

  it('should not be able to get a transaction by id, user unauthorized', async () => {
    const transaction = makeTransaction(
      {
        userId: new UniqueEntityId('user-01'),
      },
      new UniqueEntityId('transaction-01'),
    )
    inMemoryTransactionRepository.items.push(transaction)

    const result = await sut.execute({
      transactionId: 'transaction-01',
      userId: 'user-02',
    })
    expect(result.isLeft()).toBeTruthy()
  })
})
