import { Entity } from '../core/entities/entity'

interface CategoryProps {
  type: 'deposit' | 'spent'
  name: string
}

export class Category extends Entity<CategoryProps> {}
