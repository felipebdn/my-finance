import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { UserPayload } from './utils-google/utils-jwt/jwt-strategy'

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return request.user as UserPayload
  },
)
