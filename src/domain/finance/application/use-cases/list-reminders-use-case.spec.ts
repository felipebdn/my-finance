import { makeReminder } from 'test/factories/make-reminder'
import { InMemoryReminderRepository } from 'test/repositories/in-memory-reminder-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ListRemindersUseCase } from './list-reminders-use-case'

let inMemoryReminderRepository: InMemoryReminderRepository
let sut: ListRemindersUseCase

describe('List Reminders', () => {
  beforeEach(() => {
    inMemoryReminderRepository = new InMemoryReminderRepository()
    sut = new ListRemindersUseCase(inMemoryReminderRepository)
  })

  it('should be able to list a reminders', async () => {
    const reminder1 = makeReminder({
      userId: new UniqueEntityId('user-01'),
      type: 'deposit',
    })
    const reminder2 = makeReminder({
      userId: new UniqueEntityId('user-01'),
      type: 'spent',
    })
    inMemoryReminderRepository.items.push(reminder1, reminder2)

    const result1 = await sut.execute({
      userId: 'user-01',
      type: 'deposit',
    })

    expect(result1.isRight()).toBeTruthy()
    if (result1.isRight()) {
      expect(result1.value.reminders).length(1)
    }

    const result2 = await sut.execute({
      userId: 'user-01',
    })

    expect(result2.isRight()).toBeTruthy()
    if (result2.isRight()) {
      expect(result2.value.reminders).length(2)
    }
  })
})
