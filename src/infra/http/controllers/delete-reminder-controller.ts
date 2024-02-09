import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteReminderUseCase } from '@/domain/finance/application/use-cases/delete-reminder-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteReminderParamsSchema = z.object({
  reminderId: z.string().uuid(),
  userId: z.string().uuid(),
})

type ReminderParamsSchemaType = z.infer<typeof deleteReminderParamsSchema>

@Controller('/reminder/:reminderId/:userId')
@UseGuards(JwtAuthGuard)
export class DeleteReminderController {
  constructor(private deleteReminder: DeleteReminderUseCase) {}

  @Delete()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(deleteReminderParamsSchema))
  async handle(@Param() params: ReminderParamsSchemaType) {
    const result = await this.deleteReminder.execute({
      reminderId: params.reminderId,
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
