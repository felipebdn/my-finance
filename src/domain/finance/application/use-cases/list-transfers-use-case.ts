import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { Transfer } from '../../enterprise/entities/transfer'
import { TransferRepository } from '../repositories/transfer-repository'

interface ListTransfersUseCaseRequest {
  userId: string
  inDate: Date
  untilDate: Date
  accounts: string[]
}

type ListTransfersUseCaseResponse = Either<
  unknown,
  {
    transfers: Transfer[]
  }
>

@Injectable()
export class ListTransfersUseCase {
  constructor(private transferRepository: TransferRepository) {}

  async execute({
    inDate,
    untilDate,
    userId,
    accounts,
  }: ListTransfersUseCaseRequest): Promise<ListTransfersUseCaseResponse> {
    const transfers = await this.transferRepository.findMany(userId, accounts, {
      in: inDate,
      until: untilDate,
    })

    return right({ transfers })
  }
}
