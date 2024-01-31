import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Transfer,
  TransferProps,
} from '@/domain/finance/enterprise/entities/transfer'
import { PrismaTransferMapper } from '@/infra/database/mappers/prisma-transfer-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeTransfer(
  override?: Partial<TransferProps>,
  id?: UniqueEntityId,
) {
  const transfer = Transfer.crete(
    {
      destinyId: new UniqueEntityId(),
      referentId: new UniqueEntityId(),
      userId: new UniqueEntityId(),
      value: faker.number.float({
        multipleOf: 0.01,
      }),
      ...override,
    },
    id,
  )
  return transfer
}

export class TransferFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaTransfer(data: Partial<TransferProps>) {
    const transfer = makeTransfer(data)
    await this.prisma.transfer.create({
      data: PrismaTransferMapper.toPrisma(transfer),
    })
    return transfer
  }
}
