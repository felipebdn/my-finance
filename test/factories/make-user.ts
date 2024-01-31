import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/finance/enterprise/entities/user'
import { PrismaUserMapper } from '@/infra/database/mappers/prisma-user-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeUser(override?: Partial<UserProps>, id?: UniqueEntityId) {
  const user = User.crete(
    {
      email: faker.internet.email(),
      avatarUrl: faker.internet.url(),
      googleId: new UniqueEntityId().toString(),
      name: faker.person.fullName(),
      ...override,
    },
    id,
  )
  return user
}

export class UserFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaUser(data: Partial<UserProps>) {
    const user = makeUser(data)
    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })
    return user
  }
}
