import { makeAccount } from 'test/factories/make-account'
import { makeCategory } from 'test/factories/make-category'
import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryReminderRepository } from 'test/repositories/in-memory-reminder-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { NewReminderUseCase } from './new-reminder-use-case'

let inMemoryReminderRepository: InMemoryReminderRepository
let inMemoryAccountRepository: InMemoryAccountRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: NewReminderUseCase

describe('New Reminder', () => {
  beforeEach(() => {
    inMemoryReminderRepository = new InMemoryReminderRepository()
    inMemoryAccountRepository = new InMemoryAccountRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    sut = new NewReminderUseCase(
      inMemoryReminderRepository,
      inMemoryAccountRepository,
      inMemoryCategoryRepository,
    )
  })

  it('should be able to make a new reminder', async () => {
    const account = makeAccount({
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryAccountRepository.items.push(account)
    const category = makeCategory({
      userId: new UniqueEntityId('user-01'),
    })
    inMemoryCategoryRepository.itens.push(category)

    const result = await sut.execute({
      accountId: account.id.toValue(),
      categoryId: category.id.toValue(),
      date: new Date('2022-10-05'),
      description: '',
      expires: new Date('2022-10-05'),
      frequency: 'once',
      name: 'boleto',
      type: 'deposit',
      userId: 'user-01',
      value: 400,
    })

    expect(result.isRight()).toBeTruthy()
  })
})
