import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ListTransactionByCategoryUseCase } from '@/domain/finance/application/use-cases/list-transactions-by-category-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { TransactionPresenter } from '../presenters/transaction-presenter'

const transactionsBodySchema = z.object({
  type: z.enum(['deposit', 'spent']),
  category_id: z.string().uuid(),
  account_ids: z.array(z.string()),
  user_id: z.string(),
})

const transactionsBodyPipe = new ZodValidationPipe(transactionsBodySchema)

type TransactionsQuerySchemaType = z.infer<typeof transactionsBodySchema>

@Controller('/transactions/category')
@UseGuards(JwtAuthGuard)
export class ListTransactionsController {
  constructor(private listTransactions: ListTransactionByCategoryUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Body(transactionsBodyPipe)
    body: TransactionsQuerySchemaType,
  ) {
    const result = await this.listTransactions.execute({
      accounts: body.account_ids,
      categoryId: body.category_id,
      type: body.type,
      userId: body.user_id,
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

    if (result.isRight()) {
      const { transactions } = result.value

      return {
        transactions: transactions.map(TransactionPresenter.toHTTP),
      }
    }
  }
}
