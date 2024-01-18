import { Category } from '../entities/category'

export interface CategoryRepository {
  create(category: Category): Promise<void>
  findById(id: string): Promise<Category | null>
  findByName(name: string): Promise<Category | null>
}
