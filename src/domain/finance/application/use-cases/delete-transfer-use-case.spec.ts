import { makeTransfer } from 'test/factories/make-transfer'
import { InMemoryTransferRepository } from 'test/repositories/in-memory-transfer-repository'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeleteTransferUseCase } from './delete-transfer-use-case'

let inMemoryTransferRepository: InMemoryTransferRepository
let sut: DeleteTransferUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryTransferRepository = new InMemoryTransferRepository()
    sut = new DeleteTransferUseCase(inMemoryTransferRepository)
  })

  it('should be able to create a new category', async () => {
    const transfer = makeTransfer({
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryTransferRepository.items.push(transfer)

    const result = await sut.execute({
      transferId: transfer.id.toValue(),
      userId: 'user-01',
    })
    expect(result.isRight()).toBeTruthy()
    expect(inMemoryTransferRepository.items).length(0)
  })
})
