import { EventHandler } from '@/core/events/event-handler'

export class OnReminderCreated implements EventHandler {
  constructor() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    throw new Error('Method not implemented.')
  }
}
