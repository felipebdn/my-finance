import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteCategoryUseCase } from '@/domain/finance/application/use-cases/delete-category-use-case'
import { JwtAuthGuard } from '@/infra/auth/utils-jwt/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteCategoryQuerySchema = z.object({
  category_id: z.string(),
  user_id: z.string(),
  delete_remembers: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true'),
  delete_transactions: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true'),
})

const deleteCategoryBodySchemaPipe = new ZodValidationPipe(
  deleteCategoryQuerySchema,
)

type CategoryQuerySchemaType = z.infer<typeof deleteCategoryQuerySchema>

@Controller('/category/delete')
@UseGuards(JwtAuthGuard)
export class DeleteCategoryController {
  constructor(private deleteCategory: DeleteCategoryUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Query(deleteCategoryBodySchemaPipe) query: CategoryQuerySchemaType,
  ) {
    const result = await this.deleteCategory.execute({
      categoryId: query.category_id,
      deleteReminders: query.delete_remembers,
      deleteTransactions: query.delete_transactions,
      userId: query.user_id,
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
