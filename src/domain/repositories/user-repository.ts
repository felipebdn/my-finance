import { User } from '../entities/user'

export interface UserRepository {
  create(user: User): Promise<User>
}
