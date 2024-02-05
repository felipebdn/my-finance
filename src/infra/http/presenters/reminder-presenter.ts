import { Reminder } from '@/domain/finance/enterprise/entities/reminder'

export class ReminderPresenter {
  static toHTTP(reminder: Reminder) {
    return {
      id: reminder.id.toValue(),
      user_id: reminder.userId.toValue(),
      category_id: reminder.categoryId.toValue(),
      name: reminder.name,
      value: reminder.value,
      type: reminder.type,
      frequency: reminder.frequency,
      date: reminder.date,
      expires: reminder.expires,
      description: reminder.description,
      created_at: reminder.createdAt,
      updated_at: reminder.updatedAt,
    }
  }
}
