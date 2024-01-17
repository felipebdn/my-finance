import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface CategoryProps {
  userId: UniqueEntityId
  type: 'deposit' | 'spent'
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

  static crete(
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
