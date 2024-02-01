import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { AccountRepository } from '@/domain/finance/application/repositories/account-repository'
import { CategoryRepository } from '@/domain/finance/application/repositories/category-repository'
import { ReminderRepository } from '@/domain/finance/application/repositories/reminder-repository'
import { TransactionRepository } from '@/domain/finance/application/repositories/transaction-repository'
import { TransferRepository } from '@/domain/finance/application/repositories/transfer-repository'
import { UserRepository } from '@/domain/finance/application/repositories/user-repository'
import { TransactionScope } from '@/domain/finance/application/transaction/transaction-scope'

import { PrismaClientManager, PrismaService } from './prisma/prisma.service'
import { PrismaAccountRepository } from './prisma/repositories/prisma-account-repository'
import { PrismaCategoryRepository } from './prisma/repositories/prisma-category-repository'
import { PrismaReminderRepository } from './prisma/repositories/prisma-reminder-repository'
import { PrismaTransactionRepository } from './prisma/repositories/prisma-transaction-repository'
import { PrismaTransferRepository } from './prisma/repositories/prisma-transfer-repository'
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository'

@Module({
  providers: [
    PrismaClient,
    PrismaService,
    PrismaClientManager,
    { provide: TransactionScope, useClass: PrismaService },
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: CategoryRepository, useClass: PrismaCategoryRepository },
    { provide: ReminderRepository, useClass: PrismaReminderRepository },
    { provide: TransactionRepository, useClass: PrismaTransactionRepository },
    { provide: TransferRepository, useClass: PrismaTransferRepository },
    { provide: AccountRepository, useClass: PrismaAccountRepository },
  ],
  exports: [
    TransactionScope,
    PrismaService,
    PrismaClientManager,
    UserRepository,
    CategoryRepository,
    ReminderRepository,
    TransactionRepository,
    TransferRepository,
    AccountRepository,
  ],
})
export class DatabaseModule {}
