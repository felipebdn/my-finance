import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Reminder,
  ReminderProps,
} from '@/domain/finance/enterprise/entities/reminder'

export function makeReminder(
  override?: Partial<ReminderProps>,
  id?: UniqueEntityId,
) {
  const reminder = Reminder.create(
    {
      accountId: new UniqueEntityId(),
      categoryId: new UniqueEntityId(),
      date: new Date(),
      expires: new Date(),
      frequency: 'daily',
      name: faker.lorem.words(2),
      type: 'deposit',
      userId: new UniqueEntityId(),
      value: faker.number.float({ multipleOf: 0.01 }),
      ...override,
    },
    id,
  )
  return reminder
}
