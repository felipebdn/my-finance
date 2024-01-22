import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { Reminder } from '../entities/reminder'

export class RememberIfEvent implements DomainEvent {
  public ocurredAt: Date
  public reminder: Reminder

  constructor(reminder: Reminder) {
    this.reminder = reminder
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    throw new Error('Method not implemented.')
  }
}
