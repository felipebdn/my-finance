import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { typeTransaction } from './transaction'

export interface CategoryProps {
  userId: UniqueEntityId
  type: typeTransaction
  name: string
  createdAt: Date
  updatedAt?: Date
}

export class Category extends Entity<CategoryProps> {
  get userId() {
    return this.props.userId
  }

  get type() {
    return this.props.type
  }

  get name() {
    return this.props.name
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set name(name: string) {
    this.props.name = name
  }

  set type(type: typeTransaction) {
    this.props.type = type
  }

  touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<CategoryProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const category = new Category(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return category
  }
}
