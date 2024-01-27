import { BetweenDatesParams } from '@/core/repositories/between-dates-params'

import { Transfer } from '../../enterprise/entities/transfer'

export abstract class TransferRepository {
  abstract create(transfer: Transfer): Promise<void>
  abstract delete(transfer: Transfer): Promise<void>
  abstract findById(id: string): Promise<Transfer | null>
  abstract findMany(
    orderId: string,
    ids: string[],
    params: BetweenDatesParams,
  ): Promise<Transfer[]>

  abstract findManyByAccountId(accountId: string): Promise<Transfer[]>
  abstract deleteManyByAccountId(AccountId: string): Promise<void>
}
