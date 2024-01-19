import { UserRepository } from '@/domain/finance/application/repositories/user-repository'
import { User } from '@/domain/finance/enterprise/entities/user'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async create(user: User) {
    this.items.push(user)
  }

  async save(user: User) {
    const index = this.items.findIndex((item) => item.id === user.id)
    this.items[index] = user
  }

  async delete(user: User) {
    const index = this.items.findIndex((item) => item.id === user.id)
    this.items.splice(index, 1)
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id.toValue() === id)
    if (!user) {
      return null
    }
    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)
    if (!user) {
      return null
    }
    return user
  }
}
