import { makeReminder } from 'test/factories/make-reminder'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { InMemoryReminderRepository } from 'test/repositories/in-memory-reminder-repository'
import { waitFor } from 'test/utils/await-for'
import { MockInstance } from 'vitest'

import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification-use-case'
import { OnReminderCreated } from './on-reminder-created'

let inMemoryReminderRepository: InMemoryReminderRepository
let inMemoryNotificationRepository: InMemoryNotificationRepository
let sendNotification: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Reminder Created', () => {
  beforeEach(() => {
    inMemoryReminderRepository = new InMemoryReminderRepository()
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    new OnReminderCreated(sendNotification)
  })

  it('should send a notification when an reminder is created', async () => {
    const reminder = makeReminder()

    inMemoryReminderRepository.create(reminder)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toBeCalled()
    })
  })
})
