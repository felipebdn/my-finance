import { makeAccount } from 'test/factories/make-account'
import { makeReminder } from 'test/factories/make-reminder'
import { makeTransaction } from 'test/factories/make-transaction'
import { makeTransfer } from 'test/factories/make-transfer'
import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository'
import { InMemoryReminderRepository } from 'test/repositories/in-memory-reminder-repository'
import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { InMemoryTransferRepository } from 'test/repositories/in-memory-transfer-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeleteAccountUseCase } from './delete-account-use-case'

let inMemoryAccountRepository: InMemoryAccountRepository
let inMemoryTransactionRepository: InMemoryTransactionRepository
let inMemoryReminderRepository: InMemoryReminderRepository
let inMemoryTransferRepository: InMemoryTransferRepository
let sut: DeleteAccountUseCase

describe('Delete Account', () => {
  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository()
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    inMemoryReminderRepository = new InMemoryReminderRepository()
    inMemoryTransferRepository = new InMemoryTransferRepository()
    sut = new DeleteAccountUseCase(
      inMemoryAccountRepository,
      inMemoryTransactionRepository,
      inMemoryReminderRepository,
      inMemoryTransferRepository,
    )
  })

  it('should be able to delete the account and dependencies', async () => {
    const account = makeAccount({
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryAccountRepository.items.push(account)

    const transaction = makeTransaction({
      userId: new UniqueEntityId('user-01'),
      accountId: account.id,
    })
    inMemoryTransactionRepository.items.push(transaction)

    const reminder = makeReminder({
      userId: new UniqueEntityId('user-01'),
      accountId: account.id,
    })
    inMemoryReminderRepository.items.push(reminder)

    const transfer1 = makeTransfer({
      userId: new UniqueEntityId('user-01'),
      referentId: account.id,
    })
    const transfer2 = makeTransfer({
      userId: new UniqueEntityId('user-01'),
      destinyId: account.id,
    })
    inMemoryTransferRepository.items.push(transfer1, transfer2)

    const result = await sut.execute({
      accountId: account.id.toValue(),
      userId: 'user-01',
      deleteReminder: true,
      deleteTransaction: true,
      deleteTransfer: true,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAccountRepository.items).length(0)
    expect(inMemoryTransactionRepository.items).length(0)
    expect(inMemoryReminderRepository.items).length(0)
    expect(inMemoryTransferRepository.items).length(0)
  })

  it('should be able to delete the account', async () => {
    const account = makeAccount({
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryAccountRepository.items.push(account)

    const transaction = makeTransaction({
      userId: new UniqueEntityId('user-01'),
      accountId: account.id,
    })
    inMemoryTransactionRepository.items.push(transaction)

    const reminder = makeReminder({
      userId: new UniqueEntityId('user-01'),
      accountId: account.id,
    })
    inMemoryReminderRepository.items.push(reminder)

    const transfer1 = makeTransfer({
      userId: new UniqueEntityId('user-01'),
      referentId: account.id,
    })
    const transfer2 = makeTransfer({
      userId: new UniqueEntityId('user-01'),
      destinyId: account.id,
    })
    inMemoryTransferRepository.items.push(transfer1, transfer2)

    const result = await sut.execute({
      accountId: account.id.toValue(),
      userId: 'user-01',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAccountRepository.items).length(0)
    expect(inMemoryTransactionRepository.items).length(1)
    expect(inMemoryReminderRepository.items).length(1)
    expect(inMemoryTransferRepository.items).length(2)
  })
})
