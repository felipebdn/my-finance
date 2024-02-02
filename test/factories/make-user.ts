import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/finance/enterprise/entities/user'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeUser(override?: Partial<UserProps>, id?: UniqueEntityId) {
  const user = User.create(
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

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaUser(data: Partial<UserProps>, id?: UniqueEntityId) {
    const user = makeUser(data, id)
    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })
    return user
  }
}
