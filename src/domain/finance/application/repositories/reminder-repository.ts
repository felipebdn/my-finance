import { Reminder } from '../../enterprise/entities/reminder'
import { typeTransaction } from '../../enterprise/entities/transaction'

export abstract class ReminderRepository {
  abstract create(reminder: Reminder, t?: string): Promise<void>
  abstract save(reminder: Reminder, t?: string): Promise<void>
  abstract findById(id: string, t?: string): Promise<Reminder | null>
  abstract findManyByUserId(
    orderId: string,
    type?: typeTransaction,
    t?: string,
  ): Promise<Reminder[]>

  abstract deleteManyByCategoryId(categoryId: string, t?: string): Promise<void>
  abstract deleteManyByAccountId(AccountId: string, t?: string): Promise<void>
  abstract deleteById(reminder: Reminder, t?: string): Promise<void>
}
