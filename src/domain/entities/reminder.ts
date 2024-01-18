import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { typeTransaction } from './transaction'

export type FrequencyType =
  | 'once'
  | 'daily'
  | 'weekly'
  | 'two-weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'

export interface ReminderProps {
  userId: UniqueEntityId
  accountId: UniqueEntityId
  categoryId: UniqueEntityId
  name: string
  value: number
  type: typeTransaction
  frequency: FrequencyType
  date: Date
  expires: Date
  createdAt: Date
  description?: string
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

  get value() {
    return this.props.value
  }

  get type() {
    return this.props.type
  }

  get name() {
    return this.props.name
  }

  get frequency() {
    return this.props.frequency
  }

  get date() {
    return this.props.date
  }

  get expires() {
    return this.props.expires
  }

  get description() {
    return this.props.description
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
