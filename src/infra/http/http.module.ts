import { Module } from '@nestjs/common'

import { AuthenticateUserUseCase } from '@/domain/finance/application/use-cases/authenticate-user-use-case'
import { NewDepositUseCase } from '@/domain/finance/application/use-cases/new-deposit-use-case'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { NewDepositController } from './controllers/new-deposit-controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  providers: [AuthenticateUserUseCase, NewDepositUseCase],
  controllers: [AuthenticateController, NewDepositController],
})
export class HttpModule {}
