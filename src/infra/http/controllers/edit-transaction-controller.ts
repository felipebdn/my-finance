import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EditTransactionUseCase } from '@/domain/finance/application/use-cases/edit-transaction-use-case'
import { InsufficientBalanceError } from '@/domain/finance/application/use-cases/errors/insufficient-balance-error'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editDepositBodySchema = z.object({
  account_id: z.string(),
  category_id: z.string(),
  user_id: z.string(),
  type: z.enum(['deposit', 'spent']),
  value: z.coerce.number(),
  description: z.string().optional(),
  date: z.coerce.date(),
})

const editDepositParamsSchema = z.object({
  transactionId: z.string().uuid(),
})

const EditDepositBodyPipe = new ZodValidationPipe(editDepositBodySchema)
const EditDepositParamsPipe = new ZodValidationPipe(editDepositParamsSchema)

type EditDepositBodySchema = z.infer<typeof editDepositBodySchema>
type EditDepositParamsSchema = z.infer<typeof editDepositParamsSchema>

@Controller('/transactions/:transactionId')
@UseGuards(JwtAuthGuard)
export class EditTransactionsController {
  constructor(private editTransaction: EditTransactionUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Body(EditDepositBodyPipe) body: EditDepositBodySchema,
    @Param(EditDepositParamsPipe) params: EditDepositParamsSchema,
  ) {
    const result = await this.editTransaction.execute({
      transactionId: params.transactionId,
      userId: body.user_id,
      accountId: body.account_id,
      categoryId: body.category_id,
      date: body.date,
      type: body.type,
      value: body.value,
      description: body.description,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        case InsufficientBalanceError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
