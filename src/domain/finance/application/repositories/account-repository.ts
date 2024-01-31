import { Account } from '../../enterprise/entities/account'

export abstract class AccountRepository {
  abstract create(account: Account, t?: string): Promise<void>
  abstract save(account: Account, t?: string): Promise<void>
  abstract findById(id: string, t?: string): Promise<Account | null>
  abstract findByName(name: string, t?: string): Promise<Account | null>
  abstract findManyByUserId(userId: string, t?: string): Promise<Account[]>
  abstract delete(account: Account, t?: string): Promise<void>
}
