import { CategoryRepository } from '@/domain/financy/application/repositories/category-repository'
import { Category } from '@/domain/financy/interprise/entities/category'

export class InMemoryCategoryRepository implements CategoryRepository {
  public items: Category[] = []

  async create(category: Category) {
    this.items.push(category)
  }

  async save(category: Category) {
    const categoryIndex = this.items.findIndex(
      (item) => item.id === category.id,
    )
    this.items[categoryIndex] = category
  }

  async delete(category: Category): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === category.id)

    this.items.splice(itemIndex, 1)
  }

  async findByName(name: string) {
    const category = this.items.find((item) => item.name === name)
    if (!category) {
      return null
    }
    return category
  }

  async findById(id: string) {
    const category = this.items.find((item) => item.id.toValue() === id)

    if (!category) {
      return null
    }

    return category
  }
}
