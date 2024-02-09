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
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EditAccountUseCase } from '@/domain/finance/application/use-cases/edit-account-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editAccountBodySchema = z.object({
  user_id: z.string().uuid(),
  name: z.string(),
  value: z.coerce.number(),
})
const editAccountParamsSchema = z.object({
  accountId: z.string().uuid(),
})

const editAccountBodyPipe = new ZodValidationPipe(editAccountBodySchema)
const editAccountParamsPipe = new ZodValidationPipe(editAccountParamsSchema)

type AccountIdBodyType = z.infer<typeof editAccountBodySchema>
type AccountIdParamsType = z.infer<typeof editAccountParamsSchema>

@Controller('/accounts/:accountId')
@UseGuards(JwtAuthGuard)
export class EditAccountController {
  constructor(private editAccount: EditAccountUseCase) {}

  @Put()
  @HttpCode(200)
  @UsePipes()
  async handle(
    @Body(editAccountBodyPipe) body: AccountIdBodyType,
    @Param(editAccountParamsPipe) params: AccountIdParamsType,
  ) {
    const result = await this.editAccount.execute({
      accountId: params.accountId,
      name: body.name,
      userId: body.user_id,
      value: body.value,
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
