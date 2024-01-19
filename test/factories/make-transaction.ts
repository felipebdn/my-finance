import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Transaction, TransactionProps } from '@/domain/financy/interprise/entities/transaction'

export function makeTransaction(
  override?: Partial<TransactionProps>,
  id?: UniqueEntityId,
) {
  const transaction = Transaction.crete(
    {
      accountId: new UniqueEntityId(),
      categoryId: new UniqueEntityId(),
      userId: new UniqueEntityId(),
      type: faker.datatype.boolean({ probability: 0.5 }) ? 'deposit' : 'spent',
      value: faker.number.float({ precision: 0.01 }),
      ...override,
    },
    id,
  )
  return transaction
}
