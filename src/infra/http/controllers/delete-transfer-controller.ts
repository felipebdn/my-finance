import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteTransferUseCase } from '@/domain/finance/application/use-cases/delete-transfer-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteTransferParamsSchema = z.object({
  userId: z.string().uuid(),
  transferId: z.string().uuid(),
})

const deleteTransferParamsPipe = new ZodValidationPipe(
  deleteTransferParamsSchema,
)

type DeleteTransferParamsSchemaType = z.infer<typeof deleteTransferParamsSchema>

@Controller('/transfer/:transferId/:userId')
@UseGuards(JwtAuthGuard)
export class DeleteTransferController {
  constructor(private deleteTransfer: DeleteTransferUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param(deleteTransferParamsPipe)
    params: DeleteTransferParamsSchemaType,
  ) {
    const result = await this.deleteTransfer.execute({
      transferId: params.transferId,
      userId: params.userId,
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
