import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { RememberIfEvent } from '../events/remember-if-event'
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

  set categoryId(id: UniqueEntityId) {
    this.props.categoryId = id
  }

  set accountId(id: UniqueEntityId) {
    this.props.accountId = id
  }

  set date(date: Date) {
    this.props.date = date
  }

  set expires(expires: Date) {
    this.props.expires = expires
  }

  set frequency(frequency: FrequencyType) {
    this.props.frequency = frequency
  }

  set name(name: string) {
    this.props.name = name
  }

  set type(type: typeTransaction) {
    this.props.type = type
  }

  set value(value: number) {
    this.props.value = value
  }

  set description(description: string | undefined) {
    this.props.description = description
  }

  touch() {
    this.props.updatedAt = new Date()
  }

  static create(
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

    const isNewReminder = !id

    if (isNewReminder) {
      reminder.addDomainEvent(new RememberIfEvent(reminder))
    }

    return reminder
  }
}
