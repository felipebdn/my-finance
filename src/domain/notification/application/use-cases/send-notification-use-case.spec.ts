import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { expect } from 'vitest'

import { SendNotificationUseCase } from './send-notification-use-case'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: SendNotificationUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationRepository)
  })

  it('should be able to create a new category', async () => {
    const result = await sut.execute({
      recipientId: 'recipient-01',
      title: 'notification',
    })
    expect(result.isRight()).toBeTruthy()
    expect(inMemoryNotificationRepository.items).toHaveLength(1)
  })
})
