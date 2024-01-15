import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface CategoryProps {
  type: 'deposit' | 'spent'
  name: string
  userId: UniqueEntityId
}

export class Category extends Entity<CategoryProps> {}
