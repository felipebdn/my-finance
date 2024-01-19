import { Reminder } from '../../enterprise/entities/reminder'
import { typeTransaction } from '../../enterprise/entities/transaction'

export interface ReminderRepository {
  create(reminder: Reminder): Promise<void>
  save(reminder: Reminder): Promise<void>
  findById(id: string): Promise<Reminder | null>
  findManyByUserId(orderId: string, type?: typeTransaction): Promise<Reminder[]>
  deleteManyByCategoryId(categoryId: string): Promise<void>
  deleteManyByAccountId(AccountId: string): Promise<void>
  deleteById(reminder: Reminder): Promise<void>
}