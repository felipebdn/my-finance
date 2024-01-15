import { Entity } from '../core/entities/entity'
import { UniqueEntityId } from '../core/entities/unique-entity-id'

interface TransferProps {
  value: number
  destinyId: UniqueEntityId
  referentId: UniqueEntityId
  description?: string
}

export class Transfer extends Entity<TransferProps> {}
