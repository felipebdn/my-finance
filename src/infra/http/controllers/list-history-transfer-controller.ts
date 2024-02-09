import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { ListTransfersUseCase } from '@/domain/finance/application/use-cases/list-transfers-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { TransferPresenter } from '../presenters/transfer-presenter'

const historyTransferBodySchema = z.object({
  user_id: z.string().uuid(),
  id_date: z.coerce.date(),
  until_date: z.coerce.date(),
  accounts_ids: z.array(z.string()),
})

const transactionParamsPipe = new ZodValidationPipe(historyTransferBodySchema)

type TransactionParamsType = z.infer<typeof historyTransferBodySchema>

@Controller('/transfer/list')
@UseGuards(JwtAuthGuard)
export class ListHistoryTransferController {
  constructor(private listTransactions: ListTransfersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Body(transactionParamsPipe)
    body: TransactionParamsType,
  ) {
    const result = await this.listTransactions.execute({
      accounts: body.accounts_ids,
      inDate: body.id_date,
      untilDate: body.until_date,
      userId: body.user_id,
    })

    if (!result.isRight()) {
      throw new BadRequestException()
    }

    const { transfers } = result.value

    return {
      transfers: transfers.map(TransferPresenter.toHTTP),
    }
  }
}
