import { Module } from '@nestjs/common'

import { AuthenticateUserUseCase } from '@/domain/finance/application/use-cases/authenticate-user-use-case'
import { CreateAccountUseCase } from '@/domain/finance/application/use-cases/create-account-use-case'
import { CreateCategoryUseCase } from '@/domain/finance/application/use-cases/create-category-use-case'
import { DeleteCategoryUseCase } from '@/domain/finance/application/use-cases/delete-category-use-case'
import { DeleteReminderUseCase } from '@/domain/finance/application/use-cases/delete-reminder-use-case'
import { DeleteTransactionUseCase } from '@/domain/finance/application/use-cases/delete-transaction-use-case'
import { EditCategoryUseCase } from '@/domain/finance/application/use-cases/edit-category-use-case'
import { EditReminderUseCase } from '@/domain/finance/application/use-cases/edit-reminder-use-case'
import { EditTransactionUseCase } from '@/domain/finance/application/use-cases/edit-transaction-use-case'
import { GetResumeUseCase } from '@/domain/finance/application/use-cases/get-resume-accounts-use-case'
import { GetTransactionUseCase } from '@/domain/finance/application/use-cases/get-transaction-use-case'
import { ListRemindersUseCase } from '@/domain/finance/application/use-cases/list-reminders-use-case'
import { ListTransactionWithFilterUserCase } from '@/domain/finance/application/use-cases/list-transactions-by-type-use-case'
import { NewDepositUseCase } from '@/domain/finance/application/use-cases/new-deposit-use-case'
import { NewReminderUseCase } from '@/domain/finance/application/use-cases/new-reminder-use-case'
import { NewSpentUseCase } from '@/domain/finance/application/use-cases/new-spent-use-case'
import { NewTransferUseCase } from '@/domain/finance/application/use-cases/new-transfer-use-case'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate-controller'
import { CreateAccountController } from './controllers/create-account-controller'
import { DeleteCategoryController } from './controllers/delete-category-controller'
import { DeleteReminderController } from './controllers/delete-reminder-controller'
import { DeleteTransactionsController } from './controllers/delete-transaction-controller'
import { EditCategoryController } from './controllers/edit-category-controller'
import { EditReminderController } from './controllers/edit-reminder-controller'
import { EditTransactionsController } from './controllers/edit-transaction-controller'
import { GetResumeController } from './controllers/get-resume-account-controller'
import { ListRemindersController } from './controllers/list-reminders-controller'
import { ListTransactionsByTypeController } from './controllers/list-transactions-by-type-controller'
import { NewCategoryController } from './controllers/new-category-controller'
import { NewReminderController } from './controllers/new-reminder-controller'
import { NewDepositController } from './controllers/new-transaction-controller'
import { NewTransferController } from './controllers/new-transfer-controller'
import { ViewTransactionController } from './controllers/view-transaction-controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  providers: [
    AuthenticateUserUseCase,
    NewDepositUseCase,
    NewSpentUseCase,
    GetResumeUseCase,
    GetTransactionUseCase,
    ListTransactionWithFilterUserCase,
    CreateAccountUseCase,
    NewTransferUseCase,
    NewReminderUseCase,
    ListRemindersUseCase,
    CreateCategoryUseCase,
    EditCategoryUseCase,
    DeleteCategoryUseCase,
    EditReminderUseCase,
    DeleteReminderUseCase,
    EditTransactionUseCase,
    DeleteTransactionUseCase,
  ],
  controllers: [
    AuthenticateController,
    NewDepositController,
    GetResumeController,
    ViewTransactionController,
    ListTransactionsByTypeController,
    CreateAccountController,
    NewTransferController,
    NewReminderController,
    ListRemindersController,
    NewCategoryController,
    EditCategoryController,
    DeleteCategoryController,
    EditReminderController,
    DeleteReminderController,
    EditTransactionsController,
    DeleteTransactionsController,
  ],
})
export class HttpModule {}
