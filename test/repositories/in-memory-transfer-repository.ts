import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

import { BetweenDatesParams } from '@/core/repositories/between-dates-params'
import { Transfer } from '@/domain/entities/transfer'
import { TransferRepository } from '@/domain/repositories/transfer-repository'

dayjs.extend(isBetween)

export class InMemoryTransferRepository implements TransferRepository {
  public items: Transfer[] = []

  async create(transfer: Transfer) {
    this.items.push(transfer)
  }

  async delete(transfer: Transfer) {
    const index = this.items.findIndex((item) => item.id === transfer.id)

    this.items.splice(index, 1)
  }

  async findById(id: string) {
    const transfer = this.items.find((item) => item.id.toValue() === id)
    if (!transfer) {
      return null
    }
    return transfer
  }

  async findMany(userId: string, params: BetweenDatesParams) {
    const transfers = this.items
      .filter(
        (item) =>
          item.userId.toValue() === userId &&
          dayjs(item.date).isBetween(params.in, params.until),
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime())
    return transfers
  }

  async findManyByAccountId(accountId: string) {
    const transfers = this.items.filter(
      (item) =>
        item.destinyId.toValue() === accountId ||
        item.referentId.toValue() === accountId,
    )
    return transfers
  }

  async deleteManyByAccountId(accountId: string) {
    const transfers = this.items.filter(
      (item) =>
        item.destinyId.toValue() !== accountId &&
        item.referentId.toValue() !== accountId,
    )

    this.items = transfers
  }
}
