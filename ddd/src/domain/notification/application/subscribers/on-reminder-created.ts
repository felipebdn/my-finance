import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { RememberIfEvent } from '@/domain/finance/enterprise/events/remember-if-event'

import { SendNotificationUseCase } from '../use-cases/send-notification-use-case'

export class OnReminderCreated implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event: unknown) =>
        this.sendRememberIfNotification(event as RememberIfEvent),
      RememberIfEvent.name,
    )
  }

  private async sendRememberIfNotification(event: RememberIfEvent) {
    this.sendNotification.execute({
      recipientId: event.reminder.userId.toValue(),
      title: `Lembre-se do pagamento '${event.reminder.name}'`,
    })
  }
}
