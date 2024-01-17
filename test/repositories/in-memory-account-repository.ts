import { Account } from '@/domain/entities/account'
import { AccountRepository } from '@/domain/repositories/account-repository'

export class InMemoryAccountRepository implements AccountRepository {
  public items: Account[] = []

  async save(account: Account): Promise<void> {
    const findIndex = this.items.findIndex((item) => item.id === account.id)
    this.items[findIndex] = account
  }

  async create(account: Account): Promise<void> {
    this.items.push(account)
  }

  async findById(id: string) {
    const account = this.items.find((item) => item.id.toValue() === id)

    if (!account) {
      return null
    }

    return account
  }
}
