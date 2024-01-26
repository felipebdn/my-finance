import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationRepository implements NotificationRepository {
  public items: Notification[] = []

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(notification: Notification) {
    const index = this.items.findIndex((item) => item.id === notification.id)
    this.items[index] = notification
  }

  async findById(id: string) {
    const notification = this.items.find((item) => item.id.toValue() === id)
    if (!notification) {
      return null
    }
    return notification
  }
}
