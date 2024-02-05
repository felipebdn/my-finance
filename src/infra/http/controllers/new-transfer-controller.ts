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
import { InsufficientBalanceError } from '@/domain/finance/application/use-cases/errors/insufficient-balance-error'
import { NewTransferUseCase } from '@/domain/finance/application/use-cases/new-transfer-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const newTransferBodySchema = z.object({
  user_id: z.string(),
  destiny_id: z.string(),
  referent_id: z.string(),
  value: z.coerce.number(),
  description: z.string().optional(),
})

type TransferBodySchemaType = z.infer<typeof newTransferBodySchema>

@Controller('/transfer/new')
@UseGuards(JwtAuthGuard)
export class NewTransferController {
  constructor(private newTransfer: NewTransferUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(newTransferBodySchema))
  async handle(@Body() body: TransferBodySchemaType) {
    const result = await this.newTransfer.execute({
      destinyId: body.destiny_id,
      referentId: body.referent_id,
      userId: body.user_id,
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
