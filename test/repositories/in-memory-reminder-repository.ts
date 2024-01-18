import { Reminder } from '@/domain/entities/reminder'
import { ReminderRepository } from '@/domain/repositories/reminder-repository'

export class InMemoryReminderRepository implements ReminderRepository {
  public items: Reminder[] = []

  async create(reminder: Reminder): Promise<void> {
    this.items.push(reminder)
  }
}
