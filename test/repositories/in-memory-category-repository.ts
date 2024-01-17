import { Category } from '@/domain/entities/category'
import { CategoryRepository } from '@/domain/repositories/category-repository'

export class InMemoryCategoryRepository implements CategoryRepository {
  public itens: Category[] = []

  async create(category: Category): Promise<void> {
    this.itens.push(category)
  }

  async findById(id: string) {
    const category = this.itens.find((item) => item.id.toValue() === id)

    if (!category) {
      return null
    }

    return category
  }
}
