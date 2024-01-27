import { Reminder } from '../../enterprise/entities/reminder'
import { typeTransaction } from '../../enterprise/entities/transaction'

export abstract class ReminderRepository {
  abstract create(reminder: Reminder): Promise<void>
  abstract save(reminder: Reminder): Promise<void>
  abstract findById(id: string): Promise<Reminder | null>
  abstract findManyByUserId(
    orderId: string,
    type?: typeTransaction,
  ): Promise<Reminder[]>

  abstract deleteManyByCategoryId(categoryId: string): Promise<void>
  abstract deleteManyByAccountId(AccountId: string): Promise<void>
  abstract deleteById(reminder: Reminder): Promise<void>
}
