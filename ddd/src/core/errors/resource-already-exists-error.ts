import { UseCaseError } from '@/core/errors/use-case-error'

export class ResourceAlreadyExistsError extends Error implements UseCaseError {
  constructor(value?: string) {
    super(`Resource already exists${value && ` [${value}]`}.`)
  }
}
