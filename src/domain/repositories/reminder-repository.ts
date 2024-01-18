import { Reminder } from '../entities/reminder'

export interface ReminderRepository {
  create(reminder: Reminder): Promise<void>
}
