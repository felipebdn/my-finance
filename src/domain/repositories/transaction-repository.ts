import { PaginationParams } from '@/core/repositories/pagination-params'

import { Transaction } from '../entities/transaction'

export interface TransactionRepository {
  create(transaction: Transaction): Promise<void>
  findById(id: string): Promise<Transaction | null>
  findManyBy(
    type: string,
    userId: string,
    accountId?: string,
    params: PaginationParams,
  ): Promise<Transaction[]>
}
