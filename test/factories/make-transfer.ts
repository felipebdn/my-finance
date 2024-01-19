import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Transfer, TransferProps } from '@/domain/financy/interprise/entities/transfer'

export function makeTransfer(
  override?: Partial<TransferProps>,
  id?: UniqueEntityId,
) {
  const transfer = Transfer.crete(
    {
      destinyId: new UniqueEntityId(),
      referentId: new UniqueEntityId(),
      userId: new UniqueEntityId(),
      value: faker.number.float({
        precision: 0.01,
      }),
      ...override,
    },
    id,
  )
  return transfer
}
