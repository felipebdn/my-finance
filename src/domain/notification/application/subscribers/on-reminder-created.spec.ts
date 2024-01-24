import { makeReminder } from 'test/factories/make-reminder'
import { InMemoryReminderRepository } from 'test/repositories/in-memory-reminder-repository'

import { OnReminderCreated } from './on-reminder-created'

let inMemoryReminderRepository: InMemoryReminderRepository

describe('On Reminder Created', () => {
  beforeEach(() => {
    inMemoryReminderRepository = new InMemoryReminderRepository()
  })

  it('should send a notification when an reminder is created', async () => {
    new OnReminderCreated()

    const reminder = makeReminder()

    inMemoryReminderRepository.create(reminder)
  })
})
