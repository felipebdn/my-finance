import { Entity } from '@/core/entities/entity'

interface UserProps {
  name: string
  email: string
}

export class User extends Entity<UserProps> {}
