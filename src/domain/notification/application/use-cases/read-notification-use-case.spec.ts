import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { ReadNotificationUseCase } from './read-notification-use-case'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()
    inMemoryNotificationRepository.items.push(notification)

    const result = await sut.execute({
      notificationId: notification.id.toValue(),
      recipientId: notification.recipientId.toValue(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })
  it('should be able to read a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('recipient-01'),
    })
    inMemoryNotificationRepository.items.push(notification)

    const result = await sut.execute({
      notificationId: notification.id.toValue(),
      recipientId: 'recipient-02',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
