import { Either, right } from '@/core/either'

import { Transfer } from '../entities/transfer'
import { TransferRepository } from '../repositories/transfer-repository'

interface ListTransfersUseCaseRequest {
  userId: string
  inDate: Date
  untilDate: Date
}

type ListTransfersUseCaseResponse = Either<
  unknown,
  {
    transfers: Transfer[]
  }
>

export class ListTransfersUseCase {
  constructor(private transferRepository: TransferRepository) {}

  async execute({
    inDate,
    untilDate,
    userId,
  }: ListTransfersUseCaseRequest): Promise<ListTransfersUseCaseResponse> {
    const transfers = await this.transferRepository.findMany(userId, {
      in: inDate,
      until: untilDate,
    })

    return right({ transfers })
  }
}
