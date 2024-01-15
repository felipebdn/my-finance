import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface TransactionProps {
  userId: UniqueEntityId
  accountId: UniqueEntityId
  categoryId: UniqueEntityId
  type: 'deposit' | 'spent'
  value: number
  description?: string
  date?: Date
  createdAt: Date
  updatedAt?: Date
}

export class Transaction extends Entity<TransactionProps> {
  static crete(
    props: Optional<TransactionProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const transaction = new Transaction(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return transaction
  }
}
