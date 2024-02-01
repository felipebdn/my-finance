import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Transaction,
  TransactionProps,
} from '@/domain/finance/enterprise/entities/transaction'
import { PrismaTransactionMapper } from '@/infra/database/prisma/mappers/prisma-transaction-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

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
      value: faker.number.float({ multipleOf: 0.01 }),
      ...override,
    },
    id,
  )
  return transaction
}

@Injectable()
export class TransactionFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaTransaction(data: Partial<TransactionProps>) {
    const transaction = makeTransaction(data)
    await this.prisma.transaction.create({
      data: PrismaTransactionMapper.toPrisma(transaction),
    })
    return transaction
  }
}
