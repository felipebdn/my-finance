export abstract class TransactionScope {
  abstract run(fn: () => Promise<void>, transactionKey?: string): Promise<void>
}
