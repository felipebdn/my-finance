import { Module } from '@nestjs/common'

import { AuthenticateUserUseCase } from '@/domain/finance/application/use-cases/authenticate-user-use-case'
import { GetResumeUseCase } from '@/domain/finance/application/use-cases/get-resume-accounts-use-case'
import { NewDepositUseCase } from '@/domain/finance/application/use-cases/new-deposit-use-case'
import { NewSpentUseCase } from '@/domain/finance/application/use-cases/new-spent-use-case'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { GetResumeController } from './controllers/get-resume-account-controller'
import { NewDepositController } from './controllers/new-transaction-controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  providers: [
    AuthenticateUserUseCase,
    NewDepositUseCase,
    NewSpentUseCase,
    GetResumeUseCase,
  ],
  controllers: [
    AuthenticateController,
    NewDepositController,
    GetResumeController,
  ],
})
export class HttpModule {}
