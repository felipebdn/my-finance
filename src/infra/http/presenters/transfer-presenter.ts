import { Transfer } from '@/domain/finance/enterprise/entities/transfer'

export class TransferPresenter {
  static toHTTP(transfer: Transfer) {
    return {
      id: transfer.id.toValue(),
      userId: transfer.userId.toValue(),
      destinyId: transfer.destinyId.toValue(),
      referentId: transfer.referentId.toValue(),
      value: transfer.value,
      date: transfer.date,
      description: transfer.description,
    }
  }
}
