import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Category,
  CategoryProps,
} from '@/domain/finance/enterprise/entities/category'

export function makeCategory(
  override?: Partial<CategoryProps>,
  id?: UniqueEntityId,
) {
  const category = Category.crete(
    {
      userId: new UniqueEntityId(),
      name: faker.person.firstName(),
      type: faker.datatype.boolean() ? 'deposit' : 'spent',
      ...override,
    },
    id,
  )
  return category
}
