import { Entity } from '../core/entities/entity'
import { UniqueEntityId } from '../core/entities/unique-entity-id'

interface TransactionProps {
  type: 'deposit' | 'spent'
  value: number
  accountId: UniqueEntityId
  categoryId: UniqueEntityId
  description?: string
  date?: Date
}

export class Transaction extends Entity<TransactionProps> {}
