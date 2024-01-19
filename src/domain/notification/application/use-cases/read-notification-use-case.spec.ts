import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { expect } from 'vitest'

import { ReadNotificationUseCase } from './read-notification-use-case'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: ReadNotificationUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository)
  })

  it('should be able to create a new category', async () => {
    const notification = makeNotification()
    inMemoryNotificationRepository.items.push(notification)

    const result = await sut.execute({
      notificationId: notification.id.toValue(),
      recipientId: notification.recipientId.toValue(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryNotificationRepository.items[0].readAt).toBeTruthy()
  })
})
