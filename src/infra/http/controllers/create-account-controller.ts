import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'
import { CreateAccountUseCase } from '@/domain/finance/application/use-cases/create-account-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const newAccountBodySchema = z.object({
  name: z.string(),
  value: z.coerce.number(),
  user_id: z.string(),
})

type AccountIdQueryParamsType = z.infer<typeof newAccountBodySchema>

@Controller('/accounts/new')
@UseGuards(JwtAuthGuard)
export class CreateAccountController {
  constructor(private newAccount: CreateAccountUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(newAccountBodySchema))
  async handle(@Body() body: AccountIdQueryParamsType) {
    const result = await this.newAccount.execute({
      name: body.name,
      userId: body.user_id,
      value: body.value,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
