import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export type typeTransaction = 'deposit' | 'spent'

export interface TransactionProps {
  userId: UniqueEntityId
  accountId: UniqueEntityId
  categoryId: UniqueEntityId
  type: typeTransaction
  value: number
  description?: string
  date: Date
  createdAt: Date
  updatedAt?: Date
}

export class Transaction extends Entity<TransactionProps> {
  get userId() {
    return this.props.userId
  }

  get accountId() {
    return this.props.accountId
  }

  get categoryId() {
    return this.props.categoryId
  }

  get type() {
    return this.props.type
  }

  get value() {
    return this.props.value
  }

  get description() {
    return this.props.description
  }

  get date() {
    return this.props.date
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set accountId(id: UniqueEntityId) {
    this.props.accountId = id
  }

  set categoryId(id: UniqueEntityId) {
    this.props.categoryId = id
  }

  set date(date: Date) {
    this.props.date = date
  }

  set description(description: string | undefined) {
    this.props.description = description
  }

  set type(type: typeTransaction) {
    this.props.type = type
  }

  set value(value: number) {
    this.props.value = value
  }

  touch() {
    this.props.updatedAt = new Date()
  }

  static crete(
    props: Optional<TransactionProps, 'createdAt' | 'date'>,
    id?: UniqueEntityId,
  ) {
    const transaction = new Transaction(
      {
        ...props,
        date: props.date ?? new Date(),
        createdAt: new Date(),
      },
      id,
    )

    return transaction
  }
}
