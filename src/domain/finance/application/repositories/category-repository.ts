import { Category } from '../../enterprise/entities/category'

export abstract class CategoryRepository {
  abstract create(category: Category, t?: string): Promise<void>
  abstract save(category: Category, t?: string): Promise<void>
  abstract delete(category: Category, t?: string): Promise<void>
  abstract findById(id: string, t?: string): Promise<Category | null>
  abstract findByName(name: string, t?: string): Promise<Category | null>
}
