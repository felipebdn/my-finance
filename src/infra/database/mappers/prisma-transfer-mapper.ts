import { Prisma, Transfer as PrismaTransfer } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Transfer } from '@/domain/finance/enterprise/entities/transfer'

export class PrismaTransferMapper {
  static toDomain(raw: PrismaTransfer): Transfer {
    return Transfer.crete(
      {
        destinyId: new UniqueEntityId(raw.destinyId),
        referentId: new UniqueEntityId(raw.referentId),
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

  static toPrisma(transfer: Transfer): Prisma.TransferUncheckedCreateInput {
    return {
      date: transfer.date,
      destinyId: transfer.destinyId.toValue(),
      referentId: transfer.referentId.toValue(),
      userId: transfer.userId.toValue(),
      value: transfer.value,
      createdAt: transfer.createdAt,
      description: transfer.description,
      id: transfer.id.toValue(),
      updatedAt: transfer.updatedAt,
    }
  }
}
