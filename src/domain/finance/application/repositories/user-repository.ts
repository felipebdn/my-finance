import { User } from '../../enterprise/entities/user'

export abstract class UserRepository {
  abstract create(user: User, t?: string): Promise<void>
  abstract save(user: User, t?: string): Promise<void>
  abstract delete(user: User, t?: string): Promise<void>
  abstract findById(id: string, t?: string): Promise<User | null>
  abstract findByEmail(email: string, t?: string): Promise<User | null>
}
