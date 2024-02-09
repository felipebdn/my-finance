import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteTransactionUseCase } from '@/domain/finance/application/use-cases/delete-transaction-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteDepositParamsSchema = z.object({
  transactionId: z.string().uuid(),
  userId: z.string().uuid(),
})

const DeleteDepositParamsPipe = new ZodValidationPipe(deleteDepositParamsSchema)

type DeleteDepositParamsSchema = z.infer<typeof deleteDepositParamsSchema>

@Controller('/transactions/:transactionId/:userId')
@UseGuards(JwtAuthGuard)
export class DeleteTransactionsController {
  constructor(private deleteTransaction: DeleteTransactionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param(DeleteDepositParamsPipe) params: DeleteDepositParamsSchema,
  ) {
    const result = await this.deleteTransaction.execute({
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
  }
}
