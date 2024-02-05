import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { ListRemindersUseCase } from '@/domain/finance/application/use-cases/list-reminders-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ReminderPresenter } from '../presenters/reminder-presenter'

const remindersQuerySchema = z.object({
  type: z.enum(['deposit', 'spent']).optional(),
  user_id: z.string(),
})

const remindersQueryPipe = new ZodValidationPipe(remindersQuerySchema)

type RemindersQuerySchemaType = z.infer<typeof remindersQuerySchema>

@Controller('/reminders/list')
@UseGuards(JwtAuthGuard)
export class ListRemindersController {
  constructor(private listReminders: ListRemindersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query(remindersQueryPipe)
    query: RemindersQuerySchemaType,
  ) {
    const result = await this.listReminders.execute({
      userId: query.user_id,
      type: query.type,
    })

    if (!result.isRight()) {
      throw new BadRequestException()
    }

    const { reminders } = result.value

    return {
      reminders: reminders.map(ReminderPresenter.toHTTP),
    }
  }
}
