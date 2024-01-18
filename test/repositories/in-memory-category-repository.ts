import { Category } from '@/domain/entities/category'
import { CategoryRepository } from '@/domain/repositories/category-repository'

export class InMemoryCategoryRepository implements CategoryRepository {
  public items: Category[] = []

  async findByName(name: string) {
    const category = this.items.find((item) => item.name === name)
    if (!category) {
      return null
    }
    return category
  }

  async create(category: Category): Promise<void> {
    this.items.push(category)
  }

  async findById(id: string) {
    const category = this.items.find((item) => item.id.toValue() === id)

    if (!category) {
      return null
    }

    return category
  }
}
