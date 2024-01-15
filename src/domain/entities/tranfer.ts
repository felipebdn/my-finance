import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface TransferProps {
  value: number
  userId: UniqueEntityId
  destinyId: UniqueEntityId
  referentId: UniqueEntityId
  description?: string
  createdAt: Date
  updatedAt?: Date
}

export class Transfer extends Entity<TransferProps> {
  static crete(
    props: Optional<TransferProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const transfer = new Transfer(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return transfer
  }
}
