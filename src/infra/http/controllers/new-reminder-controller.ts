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
import { NewReminderUseCase } from '@/domain/finance/application/use-cases/new-reminder-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const newReminderBodySchema = z.object({
  user_id: z.string(),
  account_id: z.string(),
  category_id: z.string(),
  name: z.string(),
  type: z.enum(['deposit', 'spent']),
  frequency: z.string(),
  value: z.coerce.number(),
  description: z.string().optional(),
  date: z.coerce.date(),
  expires: z.coerce.date(),
})

type ReminderBodySchemaType = z.infer<typeof newReminderBodySchema>

@Controller('/reminder/new')
@UseGuards(JwtAuthGuard)
export class NewReminderController {
  constructor(private newReminder: NewReminderUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(newReminderBodySchema))
  async handle(@Body() body: ReminderBodySchemaType) {
    const result = await this.newReminder.execute({
      userId: body.user_id,
      accountId: body.account_id,
      categoryId: body.category_id,
      date: body.date,
      description: body.description,
      expires: body.expires,
      frequency: body.frequency,
      name: body.name,
      type: body.type,
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
