import { Prisma, Transaction as PrismaTransaction } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Transaction } from '@/domain/finance/enterprise/entities/transaction'

export class PrismaTransactionMapper {
  static toDomain(raw: PrismaTransaction): Transaction {
    return Transaction.crete(
      {
        accountId: new UniqueEntityId(raw.accountId),
        categoryId: new UniqueEntityId(raw.categoryId),
        type: raw.type,
        userId: new UniqueEntityId(raw.userId),
        value: raw.value.toNumber(),
        createdAt: raw.createdAt,
        date: raw.date,
        description: raw.description,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    transaction: Transaction,
  ): Prisma.TransactionUncheckedCreateInput {
    return {
      accountId: transaction.accountId.toValue(),
      categoryId: transaction.categoryId.toValue(),
      date: transaction.date,
      type: transaction.type,
      userId: transaction.userId.toValue(),
      value: transaction.value,
      createdAt: transaction.createdAt,
      description: transaction.description,
      id: transaction.id.toValue(),
      updatedAt: transaction.updatedAt,
    }
  }
}
