import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EditCategoryUseCase } from '@/domain/finance/application/use-cases/edit-category-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editCategoryBodySchema = z.object({
  category_id: z.string(),
  user_id: z.string(),
  type: z.enum(['deposit', 'spent']),
  name: z.string(),
})

type CategoryBodySchemaType = z.infer<typeof editCategoryBodySchema>

@Controller('/category/update')
@UseGuards(JwtAuthGuard)
export class EditCategoryController {
  constructor(private editCategory: EditCategoryUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(editCategoryBodySchema))
  async handle(@Body() body: CategoryBodySchemaType) {
    const result = await this.editCategory.execute({
      categoryId: body.category_id,
      name: body.name,
      type: body.type,
      userId: body.user_id,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new ConflictException(error.message)
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        case ResourceAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
