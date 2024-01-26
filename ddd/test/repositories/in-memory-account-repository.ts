import { AccountRepository } from '@/domain/finance/application/repositories/account-repository'
import { Account } from '@/domain/finance/enterprise/entities/account'

export class InMemoryAccountRepository implements AccountRepository {
  public items: Account[] = []

  async save(account: Account) {
    const findIndex = this.items.findIndex((item) => item.id === account.id)
    this.items[findIndex] = account
  }

  async create(account: Account) {
    this.items.push(account)
  }

  async delete(account: Account) {
    const itemIndex = this.items.findIndex((item) => item.id === account.id)

    this.items.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const account = this.items.find((item) => item.id.toValue() === id)
    if (!account) {
      return null
    }
    return account
  }

  async findManyByUserId(userId: string) {
    return this.items.filter((item) => item.userId.toValue() === userId)
  }

  async findByName(name: string) {
    const account = this.items.find((item) => item.name === name)
    if (!account) {
      return null
    }
    return account
  }
}
