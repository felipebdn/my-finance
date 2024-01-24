import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { RememberIfEvent } from '@/domain/finance/enterprise/events/remember-if-event'

export class OnReminderCreated implements EventHandler {
  constructor() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      () => this.sendRememberIfNotification.bind(this),
      RememberIfEvent.name,
    )
  }

  private async sendRememberIfNotification({ reminder }: RememberIfEvent) {
    console.log(reminder)
  }
}
