import { BetweenDatesParams } from '@/core/repositories/between-dates-params'

import { Transfer } from '../entities/transfer'

export interface TransferRepository {
  create(transfer: Transfer): Promise<void>
  delete(transfer: Transfer): Promise<void>
  findById(id: string): Promise<Transfer | null>
  findMany(
    orderId: string,
    ids: string[],
    params: BetweenDatesParams,
  ): Promise<Transfer[]>
  findManyByAccountId(accountId: string): Promise<Transfer[]>
  deleteManyByAccountId(AccountId: string): Promise<void>
}
