import { Account } from '../entities/account'

export interface AccountRepository {
  create(account: Account): Promise<void>
  save(account: Account): Promise<void>
  findById(id: string): Promise<Account | null>
  findByName(name: string): Promise<Account | null>
  findManyByUserId(userId: string): Promise<Account[]>
}
