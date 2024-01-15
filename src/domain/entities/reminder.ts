import { Entity } from '../core/entities/entity'
import { UniqueEntityId } from '../core/entities/unique-entity-id'

interface ReminderProps {
  name: string
  accountId: UniqueEntityId
  categoryId: UniqueEntityId
  frequency:
    | 'once'
    | 'daily'
    | 'weekly'
    | 'two-weekly'
    | 'monthly'
    | 'quarterly'
    | 'yearly'
}

export class Reminder extends Entity<ReminderProps> {}
