import { BetweenDatesParams } from '@/core/repositories/between-dates-params'

import { Transfer } from '../../enterprise/entities/transfer'

export abstract class TransferRepository {
  abstract create(transfer: Transfer, t?: string): Promise<void>
  abstract delete(transfer: Transfer, t?: string): Promise<void>
  abstract findById(id: string, t?: string): Promise<Transfer | null>
  abstract findMany(
    orderId: string,
    ids: string[],
    params: BetweenDatesParams,
    t?: string,
  ): Promise<Transfer[]>

  abstract findManyByAccountId(
    accountId: string,
    t?: string,
  ): Promise<Transfer[]>

  abstract deleteManyByAccountId(AccountId: string, t?: string): Promise<void>
}
