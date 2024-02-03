import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GetTransactionUseCase } from '@/domain/finance/application/use-cases/get-transaction-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { TransactionPresenter } from '../presenters/transaction-presenter'

const ParamsProps = z.object({
  userId: z.string(),
  transactionId: z.string(),
})

const accountIdQueryValidationPipe = new ZodValidationPipe(ParamsProps)

type ParamsType = z.infer<typeof ParamsProps>

@Controller('/transaction/:userId/:transactionId')
@UseGuards(JwtAuthGuard)
export class ViewTransactionController {
  constructor(private getTransaction: GetTransactionUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param(accountIdQueryValidationPipe) params: ParamsType) {
    const result = await this.getTransaction.execute({
      transactionId: params.transactionId,
      userId: params.userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { transaction } = result.value

    return {
      transaction: TransactionPresenter.toHTTP(transaction),
    }
  }
}
