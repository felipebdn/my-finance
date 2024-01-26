import { User } from '../../enterprise/entities/user'

export interface UserRepository {
  create(user: User): Promise<void>
  save(user: User): Promise<void>
  delete(user: User): Promise<void>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
}
