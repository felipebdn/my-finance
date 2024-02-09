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
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EditReminderUseCase } from '@/domain/finance/application/use-cases/edit-reminder-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editReminderBodySchema = z.object({
  user_id: z.string().uuid(),
  account_id: z.string().uuid(),
  category_id: z.string().uuid(),
  name: z.string(),
  type: z.enum(['deposit', 'spent']),
  frequency: z.string(),
  value: z.coerce.number(),
  description: z.string().optional(),
  date: z.coerce.date(),
  expires: z.coerce.date(),
})
const reminderIdParamType = z.object({
  reminderId: z.string().uuid(),
})

const ReminderIdParamPipe = new ZodValidationPipe(reminderIdParamType)
const ReminderBodyPipe = new ZodValidationPipe(editReminderBodySchema)

type ReminderBodySchemaType = z.infer<typeof editReminderBodySchema>
type ReminderParamsSchemaType = z.infer<typeof reminderIdParamType>

@Controller('/reminder/:reminderId')
@UseGuards(JwtAuthGuard)
export class EditReminderController {
  constructor(private editReminder: EditReminderUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Body(ReminderBodyPipe) body: ReminderBodySchemaType,
    @Param(ReminderIdParamPipe) params: ReminderParamsSchemaType,
  ) {
    const result = await this.editReminder.execute({
      reminderId: params.reminderId,
      accountId: body.account_id,
      categoryId: body.category_id,
      userId: body.user_id,
      date: body.date,
      expires: body.expires,
      frequency: body.frequency,
      name: body.name,
      type: body.type,
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
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
