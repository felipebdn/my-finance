import { Prisma, Reminder as PrismaReminder } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Reminder } from '@/domain/finance/enterprise/entities/reminder'

export class PrismaReminderMapper {
  static toDomain(raw: PrismaReminder): Reminder {
    return Reminder.create(
      {
        accountId: new UniqueEntityId(raw.accountId),
        categoryId: new UniqueEntityId(raw.categoryId),
        date: raw.date,
        expires: raw.expires,
        frequency: raw.frequency,
        name: raw.name,
        type: raw.type,
        userId: new UniqueEntityId(raw.userId),
        value: raw.value,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(reminder: Reminder): Prisma.ReminderUncheckedCreateInput {
    return {
      id: reminder.id.toValue(),
      accountId: reminder.accountId.toValue(),
      categoryId: reminder.categoryId.toValue(),
      date: reminder.date,
      expires: reminder.expires,
      frequency: reminder.frequency,
      name: reminder.name,
      type: reminder.type,
      userId: reminder.userId.toValue(),
      value: reminder.value,
      createdAt: reminder.createdAt,
      updatedAt: reminder.updatedAt,
    }
  }
}
