import { makeReminder } from 'test/factories/make-reminder'
import { InMemoryReminderRepository } from 'test/repositories/in-memory-reminder-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeleteReminderUseCase } from './delete-reminder-use-case'

let inMemoryReminderRepository: InMemoryReminderRepository
let sut: DeleteReminderUseCase

describe('New Reminder', () => {
  beforeEach(() => {
    inMemoryReminderRepository = new InMemoryReminderRepository()
    sut = new DeleteReminderUseCase(inMemoryReminderRepository)
  })

  it('should be able to make a new reminder', async () => {
    const reminder = makeReminder(
      {
        userId: new UniqueEntityId('user-01'),
      },
      new UniqueEntityId('reminder-01'),
    )
    inMemoryReminderRepository.items.push(reminder)

    const result = await sut.execute({
      reminderId: 'reminder-01',
      userId: 'user-01',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryReminderRepository.items).length(0)
  })
})
