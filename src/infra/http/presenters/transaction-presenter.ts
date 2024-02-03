import { Transaction } from '@/domain/finance/enterprise/entities/transaction'

export class TransactionPresenter {
  static toHTTP(transaction: Transaction) {
    return {
      id: transaction.id.toValue(),
      user_id: transaction.userId.toValue(),
      account_id: transaction.accountId.toValue(),
      category_id: transaction.categoryId.toValue(),
      type: transaction.type,
      value: transaction.value,
      description: transaction.description,
      date: transaction.date,
    }
  }
}
