import { makeTransfer } from 'test/factories/make-transfer'
import { InMemoryTransferRepository } from 'test/repositories/in-memory-transfer-repository'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ListTransfersUseCase } from './list-transfers-use-case'

let inMemoryTransferRepository: InMemoryTransferRepository
let sut: ListTransfersUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryTransferRepository = new InMemoryTransferRepository()
    sut = new ListTransfersUseCase(inMemoryTransferRepository)
  })

  it('should be able to create a new category', async () => {
    const transfer1 = makeTransfer(
      {
        userId: new UniqueEntityId('user-01'),
        date: new Date('2022-01-05'),
      },
      new UniqueEntityId('transfer-01'),
    )
    const transfer2 = makeTransfer(
      {
        userId: new UniqueEntityId('user-01'),
        date: new Date('2022-01-07'),
      },
      new UniqueEntityId('transfer-02'),
    )
    const transfer3 = makeTransfer(
      {
        userId: new UniqueEntityId('user-01'),
        date: new Date('2022-01-12'),
      },
      new UniqueEntityId('transfer-03'),
    )
    const transfer4 = makeTransfer(
      {
        userId: new UniqueEntityId('user-01'),
        date: new Date('2022-01-17'),
      },
      new UniqueEntityId('transfer-04'),
    )
    inMemoryTransferRepository.items.push(
      transfer1,
      transfer2,
      transfer3,
      transfer4,
    )

    const result = await sut.execute({
      inDate: new Date('2022-01-06'),
      untilDate: new Date('2022-01-013'),
      userId: 'user-01',
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.transfers).length(2)
      expect(result.value.transfers[0].id.toValue()).toBe('transfer-03')
    }
  })
})
