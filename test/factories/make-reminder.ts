import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Reminder,
  ReminderProps,
} from '@/domain/financy/interprise/entities/reminder'

export function makeReminder(
  override?: Partial<ReminderProps>,
  id?: UniqueEntityId,
) {
  const reminder = Reminder.crete(
    {
      accountId: new UniqueEntityId(),
      categoryId: new UniqueEntityId(),
      userId: new UniqueEntityId(),
      frequency: 'daily',
      name: faker.person.fullName(),
      ...override,
    },
    id,
  )
  return reminder
}
