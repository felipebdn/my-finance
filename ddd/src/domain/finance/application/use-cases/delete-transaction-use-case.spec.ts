import { makeTransaction } from 'test/factories/make-transaction'
import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeleteTransactionUseCase } from './delete-transaction-use-case'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let sut: DeleteTransactionUseCase

describe('New Reminder', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    sut = new DeleteTransactionUseCase(inMemoryTransactionRepository)
  })

  it('should be able to make a new reminder', async () => {
    const transaction = makeTransaction({
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryTransactionRepository.items.push(transaction)

    const result = await sut.execute({
      transactionId: transaction.id.toValue(),
      userId: 'user-01',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryTransactionRepository.items).length(0)
  })
})
