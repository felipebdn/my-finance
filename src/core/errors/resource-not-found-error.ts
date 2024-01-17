import { UseCaseError } from './use-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(value?: string) {
    super(`Resource not found${value ?? ` [${value}]`}.`)
  }
}
