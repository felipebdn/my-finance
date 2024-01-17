import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Account, AccountProps } from '@/domain/entities/account'

export function makeAccount(
  override?: Partial<AccountProps>,
  id?: UniqueEntityId,
) {
  const account = Account.create(
    {
      userId: new UniqueEntityId(),
      name: faker.person.firstName(),
      value: faker.number.float(),
      ...override,
    },
    id,
  )

  return account
}
