import { Entity } from '../core/entities/entity'
import { UniqueEntityId } from '../core/entities/unique-entity-id'

interface AccountProps {
  name: string
  value: number
  userId: UniqueEntityId
}

export class Account extends Entity<AccountProps> {}
