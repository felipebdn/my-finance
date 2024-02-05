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
import { CreateCategoryUseCase } from '@/domain/finance/application/use-cases/create-category-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const newCategoryBodySchema = z.object({
  user_id: z.string(),
  type: z.enum(['deposit', 'spent']),
  name: z.string(),
})

type CategoryBodySchemaType = z.infer<typeof newCategoryBodySchema>

@Controller('/category/new')
@UseGuards(JwtAuthGuard)
export class NewCategoryController {
  constructor(private newCategory: CreateCategoryUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(newCategoryBodySchema))
  async handle(@Body() body: CategoryBodySchemaType) {
    const result = await this.newCategory.execute({
      name: body.name,
      type: body.type,
      userId: body.user_id,
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
