import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Account,
  AccountProps,
} from '@/domain/finance/enterprise/entities/account'
import { PrismaAccountMapper } from '@/infra/database/prisma/mappers/prisma-account-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

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

@Injectable()
export class AccountFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAccount(data: Partial<AccountProps>) {
    const account = makeAccount(data)
    await this.prisma.account.create({
      data: PrismaAccountMapper.toPrisma(account),
    })
    return account
  }
}
