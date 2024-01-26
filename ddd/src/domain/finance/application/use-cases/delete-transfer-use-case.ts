import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { TransferRepository } from '../repositories/transfer-repository'

interface DeleteTransferUseCaseRequest {
  transferId: string
  userId: string
}

type DeleteTransferUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  unknown
>

export class DeleteTransferUseCase {
  constructor(private transferRepository: TransferRepository) {}

  async execute({
    transferId,
    userId,
  }: DeleteTransferUseCaseRequest): Promise<DeleteTransferUseCaseResponse> {
    const transfer = await this.transferRepository.findById(transferId)
    if (!transfer) {
      return left(new ResourceNotFoundError('transfer'))
    }
    if (transfer.userId.toValue() !== userId) {
      return left(new NotAllowedError())
    }

    await this.transferRepository.delete(transfer)

    return right({})
  }
}
