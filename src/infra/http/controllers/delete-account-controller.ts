import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  Query,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteAccountUseCase } from '@/domain/finance/application/use-cases/delete-account-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteAccountParamsSchema = z.object({
  userId: z.string().uuid(),
  accountId: z.string().uuid(),
})
const deleteAccountQuerySchema = z.object({
  deleteTransaction: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true'),
  deleteReminder: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true'),
  deleteTransfer: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true'),
})

const deleteAccountParamsPipe = new ZodValidationPipe(deleteAccountParamsSchema)
const deleteAccountQueryPipe = new ZodValidationPipe(deleteAccountQuerySchema)

type AccountIdParamsType = z.infer<typeof deleteAccountParamsSchema>
type AccountIdQueryType = z.infer<typeof deleteAccountQuerySchema>

@Controller('/accounts/:accountId/:userId')
@UseGuards(JwtAuthGuard)
export class DeleteAccountController {
  constructor(private deleteAccount: DeleteAccountUseCase) {}

  @Delete()
  @HttpCode(200)
  @UsePipes()
  async handle(
    @Param(deleteAccountParamsPipe) params: AccountIdParamsType,
    @Query(deleteAccountQueryPipe) query: AccountIdQueryType,
  ) {
    const result = await this.deleteAccount.execute({
      accountId: params.accountId,
      userId: params.userId,
      deleteReminder: query.deleteReminder,
      deleteTransaction: query.deleteTransaction,
      deleteTransfer: query.deleteTransfer,
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
