import { Module } from '@nestjs/common'

import { AuthenticateUserUseCase } from '@/domain/finance/application/use-cases/authenticate-user-use-case'
import { CreateAccountUseCase } from '@/domain/finance/application/use-cases/create-account-use-case'
import { CreateCategoryUseCase } from '@/domain/finance/application/use-cases/create-category-use-case'
import { DeleteAccountUseCase } from '@/domain/finance/application/use-cases/delete-account-use-case'
import { DeleteCategoryUseCase } from '@/domain/finance/application/use-cases/delete-category-use-case'
import { DeleteReminderUseCase } from '@/domain/finance/application/use-cases/delete-reminder-use-case'
import { DeleteTransactionUseCase } from '@/domain/finance/application/use-cases/delete-transaction-use-case'
import { DeleteTransferUseCase } from '@/domain/finance/application/use-cases/delete-transfer-use-case'
import { EditAccountUseCase } from '@/domain/finance/application/use-cases/edit-account-use-case'
import { EditCategoryUseCase } from '@/domain/finance/application/use-cases/edit-category-use-case'
import { EditReminderUseCase } from '@/domain/finance/application/use-cases/edit-reminder-use-case'
import { EditTransactionUseCase } from '@/domain/finance/application/use-cases/edit-transaction-use-case'
import { GetResumeUseCase } from '@/domain/finance/application/use-cases/get-resume-accounts-use-case'
import { GetTransactionUseCase } from '@/domain/finance/application/use-cases/get-transaction-use-case'
import { ListRemindersUseCase } from '@/domain/finance/application/use-cases/list-reminders-use-case'
import { ListTransactionByCategoryUseCase } from '@/domain/finance/application/use-cases/list-transactions-by-category-use-case'
import { ListTransactionWithFilterUserCase } from '@/domain/finance/application/use-cases/list-transactions-by-type-use-case'
import { ListTransfersUseCase } from '@/domain/finance/application/use-cases/list-transfers-use-case'
import { NewDepositUseCase } from '@/domain/finance/application/use-cases/new-deposit-use-case'
import { NewReminderUseCase } from '@/domain/finance/application/use-cases/new-reminder-use-case'
import { NewSpentUseCase } from '@/domain/finance/application/use-cases/new-spent-use-case'
import { NewTransferUseCase } from '@/domain/finance/application/use-cases/new-transfer-use-case'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate-controller'
import { CreateAccountController } from './controllers/create-account-controller'
import { DeleteAccountController } from './controllers/delete-account-controller'
import { DeleteCategoryController } from './controllers/delete-category-controller'
import { DeleteReminderController } from './controllers/delete-reminder-controller'
import { DeleteTransactionsController } from './controllers/delete-transaction-controller'
import { DeleteTransferController } from './controllers/delete-transfer-controller'
import { EditAccountController } from './controllers/edit-account-controller'
import { EditCategoryController } from './controllers/edit-category-controller'
import { EditReminderController } from './controllers/edit-reminder-controller'
import { EditTransactionsController } from './controllers/edit-transaction-controller'
import { GetResumeController } from './controllers/get-resume-account-controller'
import { ListHistoryTransferController } from './controllers/list-history-transfer-controller'
import { ListRemindersController } from './controllers/list-reminders-controller'
import { ListTransactionsController } from './controllers/list-transactions-by-category-controller'
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
    EditAccountUseCase,
    DeleteAccountUseCase,
    ListTransfersUseCase,
    DeleteTransferUseCase,
    ListTransactionByCategoryUseCase,
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
    EditAccountController,
    DeleteAccountController,
    ListHistoryTransferController,
    DeleteTransferController,
    ListTransactionsController,
  ],
})
export class HttpModule {}
