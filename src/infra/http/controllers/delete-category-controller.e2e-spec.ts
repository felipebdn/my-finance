import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-account'
import { CategoryFactory } from 'test/factories/make-category'
import { ReminderFactory } from 'test/factories/make-reminder'
import { TransactionFactory } from 'test/factories/make-transaction'
import { UserFactory } from 'test/factories/make-user'
import { configureSession } from 'test/utils/test-utils'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'

describe('Delete Category [e2e]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let accountFactory: AccountFactory
  let categoryFactory: CategoryFactory
  let reminderFactory: ReminderFactory
  let transactionFactory: TransactionFactory
  let envService: EnvService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        CategoryFactory,
        ReminderFactory,
        TransactionFactory,
        AccountFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    accountFactory = moduleRef.get(AccountFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    reminderFactory = moduleRef.get(ReminderFactory)
    transactionFactory = moduleRef.get(TransactionFactory)
    envService = moduleRef.get(EnvService)
    jwt = moduleRef.get(JwtService)

    configureSession(app, envService)

    await app.init()
  })

  test('[DELETE] /category/delete - delete category', async () => {
    const user = await userFactory.makePrismaUser({})

    const account = await accountFactory.makePrismaAccount({
      userId: user.id,
    })
    const category = await categoryFactory.makePrismaCategory({
      userId: user.id,
      name: 'comida',
      type: 'spent',
    })

    const category2 = await categoryFactory.makePrismaCategory({
      userId: user.id,
      name: 'comida',
      type: 'spent',
    })
    await reminderFactory.makePrismaReminder({
      categoryId: category.id,
      accountId: account.id,
      userId: user.id,
    })
    await reminderFactory.makePrismaReminder({
      categoryId: category2.id,
      accountId: account.id,
      userId: user.id,
    })
    await transactionFactory.makePrismaTransaction({
      accountId: account.id,
      categoryId: category.id,
      userId: user.id,
    })
    await transactionFactory.makePrismaTransaction({
      accountId: account.id,
      categoryId: category2.id,
      userId: user.id,
    })
    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const response1 = await request(app.getHttpServer())
      .delete('/category/delete')
      .query({
        category_id: category.id.toString(),
        user_id: user.id.toValue(),
        delete_remembers: false,
        delete_transactions: false,
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response1.statusCode).toBe(204)
    expect(await prisma.reminder.findMany()).toHaveLength(2)
    expect(await prisma.transaction.findMany()).toHaveLength(2)

    const response2 = await request(app.getHttpServer())
      .delete('/category/delete')
      .query({
        category_id: category2.id.toString(),
        user_id: user.id.toValue(),
        delete_remembers: true,
        delete_transactions: true,
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response2.statusCode).toBe(204)
    expect(await prisma.reminder.findMany()).toHaveLength(1)
    expect(await prisma.transaction.findMany()).toHaveLength(1)
  })
})
