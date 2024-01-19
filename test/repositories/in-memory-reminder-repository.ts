import { Reminder } from '@/domain/entities/reminder'
import { typeTransaction } from '@/domain/entities/transaction'
import { ReminderRepository } from '@/domain/repositories/reminder-repository'

export class InMemoryReminderRepository implements ReminderRepository {
  public items: Reminder[] = []

  async create(reminder: Reminder): Promise<void> {
    this.items.push(reminder)
  }

  async save(reminder: Reminder) {
    const index = this.items.findIndex((item) => item.id === reminder.id)
    this.items[index] = reminder
  }

  async findById(id: string) {
    const reminder = this.items.find((item) => item.id.toValue() === id)
    if (!reminder) {
      return null
    }
    return reminder
  }

  async findManyByUserId(orderId: string, type?: typeTransaction) {
    if (type) {
      const reminders = this.items.filter(
        (item) => item.userId.toValue() === orderId && item.type === type,
      )
      return reminders
    } else {
      const reminders = this.items.filter((item) => item.userId.toValue())
      return reminders
    }
  }

  async deleteManyByCategoryId(categoryId: string) {
    this.items = this.items.filter(
      (item) => item.categoryId.toValue() !== categoryId,
    )
  }

  async deleteById(reminder: Reminder) {
    const itemIndex = this.items.findIndex((item) => item.id === reminder.id)

    this.items.splice(itemIndex, 1)
  }
}
