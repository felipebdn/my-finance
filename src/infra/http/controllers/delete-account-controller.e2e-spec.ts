import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-account'
import { CategoryFactory } from 'test/factories/make-category'
import { ReminderFactory } from 'test/factories/make-reminder'
import { TransactionFactory } from 'test/factories/make-transaction'
import { TransferFactory } from 'test/factories/make-transfer'
import { UserFactory } from 'test/factories/make-user'
import { configureSession } from 'test/utils/test-utils'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'

describe('Delete Account [e2e]', () => {
  let prisma: PrismaService
  let app: INestApplication
  let userFactory: UserFactory
  let accountRepository: AccountFactory
  let transactionFactory: TransactionFactory
  let reminderFactory: ReminderFactory
  let transferFactory: TransferFactory
  let categoryFactory: CategoryFactory
  let envService: EnvService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        AccountFactory,
        TransactionFactory,
        ReminderFactory,
        TransferFactory,
        CategoryFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    accountRepository = moduleRef.get(AccountFactory)
    transactionFactory = moduleRef.get(TransactionFactory)
    reminderFactory = moduleRef.get(ReminderFactory)
    transferFactory = moduleRef.get(TransferFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    envService = moduleRef.get(EnvService)
    jwt = moduleRef.get(JwtService)

    configureSession(app, envService)

    await app.init()
  })

  test('[DELETE] /accounts/:accountId/:userId?params - delete account', async () => {
    const user = await userFactory.makePrismaUser({})
    const account = await accountRepository.makePrismaAccount({
      name: 'account name',
      userId: user.id,
      value: 100,
    })
    const account2 = await accountRepository.makePrismaAccount({
      name: 'account name',
      userId: user.id,
      value: 50,
    })

    const category = await categoryFactory.makePrismaCategory({
      userId: user.id,
    })

    await transactionFactory.makePrismaTransaction({
      accountId: account.id,
      categoryId: category.id,
      userId: user.id,
    })
    await reminderFactory.makePrismaReminder({
      accountId: account.id,
      categoryId: category.id,
      userId: user.id,
    })
    await transferFactory.makePrismaTransfer({
      destinyId: account2.id,
      referentId: account.id,
      userId: user.id,
    })

    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const response = await request(app.getHttpServer())
      .delete(`/accounts/${account.id.toString()}/${user.id.toString()}`)
      .query({
        deleteTransaction: true,
        deleteReminder: true,
        deleteTransfer: true,
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect((await prisma.account.findMany()).length).toBe(1)
    expect((await prisma.transaction.findMany()).length).toBe(0)
    expect((await prisma.transfer.findMany()).length).toBe(0)
    expect((await prisma.reminder.findMany()).length).toBe(0)
  })

  test('[DELETE] /accounts/:accountId/:userId - delete account', async () => {
    const user = await userFactory.makePrismaUser({})
    const account = await accountRepository.makePrismaAccount({
      name: 'account name',
      userId: user.id,
      value: 100,
    })
    const account2 = await accountRepository.makePrismaAccount({
      name: 'account name',
      userId: user.id,
      value: 50,
    })

    const category = await categoryFactory.makePrismaCategory({
      userId: user.id,
    })

    await transactionFactory.makePrismaTransaction({
      accountId: account.id,
      categoryId: category.id,
      userId: user.id,
    })
    await reminderFactory.makePrismaReminder({
      accountId: account.id,
      categoryId: category.id,
      userId: user.id,
    })
    await transferFactory.makePrismaTransfer({
      destinyId: account2.id,
      referentId: account.id,
      userId: user.id,
    })

    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const response = await request(app.getHttpServer())
      .delete(`/accounts/${account.id.toString()}/${user.id.toString()}`)
      .query({
        deleteTransaction: false,
        deleteReminder: false,
        deleteTransfer: false,
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect((await prisma.account.findMany()).length).toBe(2)
    expect((await prisma.transaction.findMany()).length).toBe(1)
    expect((await prisma.transfer.findMany()).length).toBe(1)
    expect((await prisma.reminder.findMany()).length).toBe(1)
  })
})
