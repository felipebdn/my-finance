import { Account } from '../entities/account'

export interface AccountRepository {
  create(account: Account): Promise<void>
  save(account: Account): Promise<void>
  findById(id: string): Promise<Account | null>
}
