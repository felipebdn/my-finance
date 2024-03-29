import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface TransferProps {
  userId: UniqueEntityId
  destinyId: UniqueEntityId
  referentId: UniqueEntityId
  value: number
  date: Date
  description?: string
  createdAt: Date
  updatedAt?: Date
}

export class Transfer extends Entity<TransferProps> {
  get userId() {
    return this.props.userId
  }

  get destinyId() {
    return this.props.destinyId
  }

  get referentId() {
    return this.props.referentId
  }

  get value() {
    return this.props.value
  }

  get date() {
    return this.props.date
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

  static create(
    props: Optional<TransferProps, 'createdAt' | 'date'>,
    id?: UniqueEntityId,
  ) {
    const transfer = new Transfer(
      {
        ...props,
        date: props.date ?? new Date(),
        createdAt: new Date(),
      },
      id,
    )

    return transfer
  }
}
