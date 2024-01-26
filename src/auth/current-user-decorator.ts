import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { UserPayload } from './utils-jwt/jwt-strategy'

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return request.user as UserPayload
  },
)
