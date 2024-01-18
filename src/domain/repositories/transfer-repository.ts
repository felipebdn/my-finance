import { Transfer } from '../entities/transfer'

export interface TransferRepository {
  create(transfer: Transfer): Promise<void>
}
