import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface ReminderProps {
  userId: UniqueEntityId
  accountId: UniqueEntityId
  categoryId: UniqueEntityId
  name: string
  frequency:
    | 'once'
    | 'daily'
    | 'weekly'
    | 'two-weekly'
    | 'monthly'
    | 'quarterly'
    | 'yearly'
  createdAt: Date
  updatedAt?: Date
}

export class Reminder extends Entity<ReminderProps> {
  get userId() {
    return this.props.userId
  }

  get accountId() {
    return this.props.accountId
  }

  get categoryId() {
    return this.props.categoryId
  }

  get name() {
    return this.props.name
  }

  get frequency() {
    return this.props.frequency
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static crete(
    props: Optional<ReminderProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const reminder = new Reminder(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return reminder
  }
}
