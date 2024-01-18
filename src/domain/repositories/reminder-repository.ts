import { Reminder } from '../entities/reminder'
import { typeTransaction } from '../entities/transaction'

export interface ReminderRepository {
  create(reminder: Reminder): Promise<void>
  findManyByUserId(orderId: string, type?: typeTransaction): Promise<Reminder[]>
  deleteManyByCategoryId(categoryId: string): Promise<void>
}
