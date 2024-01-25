import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/finance/enterprise/entities/user'

export function makeUser(override?: Partial<UserProps>, id?: UniqueEntityId) {
  const user = User.crete(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      ...override,
    },
    id,
  )
  return user
}
