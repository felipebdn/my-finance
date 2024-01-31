import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Category,
  CategoryProps,
} from '@/domain/finance/enterprise/entities/category'
import { PrismaCategoryMapper } from '@/infra/database/prisma/mappers/prisma-category-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

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

export class CategoryFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaCategory(data: Partial<CategoryProps>) {
    const category = makeCategory(data)
    await this.prisma.category.create({
      data: PrismaCategoryMapper.toPrisma(category),
    })
    return category
  }
}
