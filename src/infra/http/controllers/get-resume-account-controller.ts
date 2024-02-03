import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GetResumeUseCase } from '@/domain/finance/application/use-cases/get-resume-accounts-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const AccountIdQueryParams = z.string().optional()

const accountIdQueryValidationPipe = new ZodValidationPipe(AccountIdQueryParams)

type AccountIdQueryParamsType = z.infer<typeof AccountIdQueryParams>

@Controller('/accounts/:userId')
@UseGuards(JwtAuthGuard)
export class GetResumeController {
  constructor(private getResume: GetResumeUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('account_id', accountIdQueryValidationPipe)
    accountId: AccountIdQueryParamsType,
    @Param('userId') userId: string,
  ) {
    const result = await this.getResume.execute({
      userId,
      accountId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { value } = result.value

    return {
      value,
    }
  }
}
