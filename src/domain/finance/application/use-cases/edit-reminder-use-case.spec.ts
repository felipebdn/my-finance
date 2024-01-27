import { makeAccount } from 'test/factories/make-account'
import { makeCategory } from 'test/factories/make-category'
import { makeReminder } from 'test/factories/make-reminder'
import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryReminderRepository } from 'test/repositories/in-memory-reminder-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { EditReminderUseCase } from './edit-reminder-use-case'

let inMemoryReminderRepository: InMemoryReminderRepository
let inMemoryAccountRepository: InMemoryAccountRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: EditReminderUseCase

describe('New Reminder', () => {
  beforeEach(() => {
    inMemoryReminderRepository = new InMemoryReminderRepository()
    inMemoryAccountRepository = new InMemoryAccountRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    sut = new EditReminderUseCase(
      inMemoryReminderRepository,
      inMemoryAccountRepository,
      inMemoryCategoryRepository,
    )
  })

  it('should be able to make a new reminder', async () => {
    const account = makeAccount({
      userId: new UniqueEntityId('user-01'),
    })
    const category = makeCategory({
      userId: new UniqueEntityId('user-01'),
    })
    const account1 = makeAccount({
      userId: new UniqueEntityId('user-01'),
    })
    const category1 = makeCategory({
      userId: new UniqueEntityId('user-01'),
    })
    const reminder = makeReminder({
      accountId: account.id,
      categoryId: category.id,
      date: new Date('2022-10-05'),
      description: '',
      expires: new Date('2022-10-05'),
      frequency: 'once',
      name: 'boleto',
      type: 'deposit',
      userId: new UniqueEntityId('user-01'),
      value: 400,
    })
    inMemoryAccountRepository.items.push(account, account1)
    inMemoryCategoryRepository.items.push(category, category1)
    inMemoryReminderRepository.items.push(reminder)

    const result = await sut.execute({
      reminderId: reminder.id.toValue(),
      accountId: account1.id.toValue(),
      categoryId: category1.id.toValue(),
      date: new Date('2022-10-10'),
      description: 'example description',
      expires: new Date('2022-10-20'),
      frequency: 'weekly',
      name: 'name-02',
      type: 'spent',
      userId: 'user-01',
      value: 500,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryReminderRepository.items[0].frequency).toBe('weekly')
  })
})
