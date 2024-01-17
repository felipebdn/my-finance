import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'

import { NewDepositUseCase } from './new-deposit-use-case'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let sut: NewDepositUseCase

describe('New Deposit', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    sut = new NewDepositUseCase(inMemoryTransactionRepository)
  })

  it('should be able to make a new deposit', async () => {
    const { transaction } = await sut.execute({
      accountId: 'account-standard-id',
      categoryId: 'category-id',
      userId: 'user-id',
      value: 58.87,
    })

    expect(transaction.id).toBeTruthy()
  })
})
