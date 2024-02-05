import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { ListTransactionWithFilterUserCase } from '@/domain/finance/application/use-cases/list-transactions-by-type-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { TransactionPresenter } from '../presenters/transaction-presenter'

const transactionParams = z.object({
  type: z.enum(['deposit', 'spent']),
  user_id: z.string(),
  in_date: z.coerce.date(),
  out_date: z.coerce.date(),
  account_id: z.string().optional(),
})

const transactionParamsPipe = new ZodValidationPipe(transactionParams)

type TransactionParamsType = z.infer<typeof transactionParams>

@Controller('/transactions/list')
@UseGuards(JwtAuthGuard)
export class ListTransactionsByTypeController {
  constructor(private listTransactions: ListTransactionWithFilterUserCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query(transactionParamsPipe)
    query: TransactionParamsType,
  ) {
    const result = await this.listTransactions.execute({
      inDate: query.in_date,
      outDate: query.out_date,
      type: query.type,
      userId: query.user_id,
      accountId: query.account_id,
    })

    if (!result.isRight()) {
      throw new BadRequestException()
    }

    const { transactions } = result.value

    return {
      transactions: transactions.map(TransactionPresenter.toHTTP),
    }
  }
}
