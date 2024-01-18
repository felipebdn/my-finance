import { Transfer } from '@/domain/entities/transfer'
import { TransferRepository } from '@/domain/repositories/transfer-repository'

export class InMemoryTransferRepository implements TransferRepository {
  public items: Transfer[] = []

  async create(transfer: Transfer): Promise<void> {
    this.items.push(transfer)
  }
}
