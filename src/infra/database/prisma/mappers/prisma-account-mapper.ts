import { Account as PrismaAccount, Prisma } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Account } from '@/domain/finance/enterprise/entities/account'

export class PrismaAccountMapper {
  static toDomain(raw: PrismaAccount): Account {
    return Account.create(
      {
        name: raw.name,
        userId: new UniqueEntityId(raw.userId),
        value: raw.value.toNumber(),
        createdAt: raw.createdAt,
        updateAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(account: Account): Prisma.AccountUncheckedCreateInput {
    return {
      id: account.id.toValue(),
      name: account.name,
      userId: account.userId.toValue(),
      value: account.value,
      createdAt: account.createdAt,
      updatedAt: account.updateAt,
    }
  }
}
