import { Module } from '@nestjs/common'

import { AuthenticateUserUseCase } from '@/domain/finance/application/use-cases/authenticate-user-use-case'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  providers: [AuthenticateUserUseCase],
  controllers: [AuthenticateController],
})
export class HttpModule {}
