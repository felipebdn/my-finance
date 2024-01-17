import { UseCaseError } from '@/core/errors/use-case-error'

export class InsufficientBalanceError extends Error implements UseCaseError {
  constructor() {
    super('Do not have sufficient balance.')
  }
}
