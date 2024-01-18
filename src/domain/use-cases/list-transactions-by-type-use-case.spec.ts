import { makeTransaction } from 'test/factories/make-transaction'
import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ListTransactionWithFilter } from './list-transactions-by-type-use-case'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let sut: ListTransactionWithFilter

describe('List Transactions', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    sut = new ListTransactionWithFilter(inMemoryTransactionRepository)
  })

  it('should be able to list transactions by filter with account id', async () => {
    const transaction1 = makeTransaction(
      {
        accountId: new UniqueEntityId('account-1'),
        type: 'spent',
        userId: new UniqueEntityId('user-2'),
        date: new Date('2022-01-01'),
      },
      new UniqueEntityId('transaction-01'),
    )

    inMemoryTransactionRepository.items.push(transaction1)
    const transaction2 = makeTransaction(
      {
        accountId: new UniqueEntityId('account-1'),
        type: 'deposit',
        userId: new UniqueEntityId('user-2'),
        date: new Date('2022-02-01'),
      },
      new UniqueEntityId('transaction-02'),
    )
    inMemoryTransactionRepository.items.push(transaction2)
    const transaction3 = makeTransaction(
      {
        accountId: new UniqueEntityId('account-2'),
        type: 'deposit',
        userId: new UniqueEntityId('user-2'),
        date: new Date('2022-03-09'),
      },
      new UniqueEntityId('transaction-03'),
    )
    inMemoryTransactionRepository.items.push(transaction3)
    const transaction4 = makeTransaction(
      {
        accountId: new UniqueEntityId('account-2'),
        type: 'deposit',
        userId: new UniqueEntityId('user-2'),
        date: new Date('2022-03-10'),
      },
      new UniqueEntityId('transaction-04'),
    )
    inMemoryTransactionRepository.items.push(transaction4)

    // Valida se retornará doas transaction, entre a data de 28/02/2022 e 11/03/2022
    // do tipo deposit e do account-2
    const result1 = await sut.execute({
      inDate: new Date('2022-02-28'),
      outDate: new Date('2022-03-11'),
      type: 'deposit',
      userId: 'user-2',
      accountId: 'account-2',
    })

    expect(result1.isRight()).toBeTruthy()
    if (result1.isRight()) {
      expect(result1.value.transactions.length).toBe(2)
      expect(result1.value.transactions[0].id.toString()).toBe('transaction-04')
      expect(result1.value.transactions[1].id.toString()).toBe('transaction-03')
    }

    // Valida se retornará doas transaction, entre a data de 28/02/2022 e 11/03/2022
    // buscando pelo type spent
    const result2 = await sut.execute({
      inDate: new Date('2021-01-01'),
      outDate: new Date(),
      type: 'spent',
      userId: 'user-2',
      accountId: 'account-1',
    })

    expect(result2.isRight()).toBeTruthy()
    if (result2.isRight()) {
      expect(result2.value.transactions.length).toBe(1)
      expect(result2.value.transactions[0].id.toString()).toBe('transaction-01')
    }
  })

  it('should be able to list transactions by filter without account id', async () => {
    const transaction1 = makeTransaction(
      {
        accountId: new UniqueEntityId('account-1'),
        type: 'spent',
        userId: new UniqueEntityId('user-2'),
        date: new Date('2022-01-01'),
      },
      new UniqueEntityId('transaction-01'),
    )
    inMemoryTransactionRepository.items.push(transaction1)

    const transaction2 = makeTransaction(
      {
        accountId: new UniqueEntityId('account-1'),
        type: 'deposit',
        userId: new UniqueEntityId('user-2'),
        date: new Date('2022-02-01'),
      },
      new UniqueEntityId('transaction-02'),
    )
    inMemoryTransactionRepository.items.push(transaction2)

    const transaction3 = makeTransaction(
      {
        accountId: new UniqueEntityId('account-2'),
        type: 'deposit',
        userId: new UniqueEntityId('user-2'),
        date: new Date('2022-03-09'),
      },
      new UniqueEntityId('transaction-03'),
    )
    inMemoryTransactionRepository.items.push(transaction3)

    const transaction4 = makeTransaction(
      {
        accountId: new UniqueEntityId('account-2'),
        type: 'deposit',
        userId: new UniqueEntityId('user-2'),
        date: new Date('2022-03-10'),
      },
      new UniqueEntityId('transaction-04'),
    )
    inMemoryTransactionRepository.items.push(transaction4)

    // Valida se retornará doas transaction, entre a data de 28/02/2022 e 11/03/2022
    // do tipo deposit e do account-2
    const result1 = await sut.execute({
      inDate: new Date('2022-01-01'),
      outDate: new Date('2022-03-11'),
      type: 'deposit',
      userId: 'user-2',
    })

    expect(result1.isRight()).toBeTruthy()
    if (result1.isRight()) {
      expect(result1.value.transactions.length).toBe(3)
      expect(result1.value.transactions[0].id.toString()).toBe('transaction-04')
      expect(result1.value.transactions[1].id.toString()).toBe('transaction-03')
      expect(result1.value.transactions[2].id.toString()).toBe('transaction-02')
    }
  })
})
