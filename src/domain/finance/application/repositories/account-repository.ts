import { Account } from '../../enterprise/entities/account'

export abstract class AccountRepository {
  abstract create(account: Account): Promise<void>
  abstract save(account: Account): Promise<void>
  abstract findById(id: string): Promise<Account | null>
  abstract findByName(name: string): Promise<Account | null>
  abstract findManyByUserId(userId: string): Promise<Account[]>
  abstract delete(account: Account): Promise<void>
}
