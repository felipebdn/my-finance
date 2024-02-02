import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ResourceInvalidError } from '@/domain/finance/application/use-cases/errors/resource-invalid-error'
import { NewDepositUseCase } from '@/domain/finance/application/use-cases/new-deposit-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const newDepositBodySchema = z.object({
  account_id: z.string(),
  category_id: z.string(),
  user_id: z.string(),
  value: z.coerce.number(),
  description: z.string().optional(),
  date: z.date().optional(),
})

type NewDepositBodySchema = z.infer<typeof newDepositBodySchema>

@Controller('/transactions/deposit')
@UseGuards(JwtAuthGuard)
export class NewDepositController {
  constructor(private newDeposit: NewDepositUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(newDepositBodySchema))
  async handle(@Body() body: NewDepositBodySchema) {
    const result = await this.newDeposit.execute({
      accountId: body.account_id,
      categoryId: body.category_id,
      userId: body.user_id,
      value: body.value,
      date: body.date,
      description: body.description,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        case ResourceInvalidError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
