import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface TransactionProps {
  userId: UniqueEntityId
  accountId: UniqueEntityId
  categoryId: UniqueEntityId
  type: 'deposit' | 'spent'
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
