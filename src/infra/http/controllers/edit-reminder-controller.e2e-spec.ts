import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-account'
import { CategoryFactory } from 'test/factories/make-category'
import { ReminderFactory } from 'test/factories/make-reminder'
import { UserFactory } from 'test/factories/make-user'
import { configureSession } from 'test/utils/test-utils'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'

describe('Edit Reminder [e2e]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let accountFactory: AccountFactory
  let categoryFactory: CategoryFactory
  let reminderFactory: ReminderFactory
  let envService: EnvService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        AccountFactory,
        CategoryFactory,
        ReminderFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    accountFactory = moduleRef.get(AccountFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    reminderFactory = moduleRef.get(ReminderFactory)
    envService = moduleRef.get(EnvService)
    jwt = moduleRef.get(JwtService)

    configureSession(app, envService)

    await app.init()
  })

  test('[PUT] /reminder/:reminderId - edit reminder', async () => {
    const user = await userFactory.makePrismaUser({})

    const account1 = await accountFactory.makePrismaAccount({
      userId: user.id,
    })
    const account2 = await accountFactory.makePrismaAccount({
      userId: user.id,
    })
    const category1 = await categoryFactory.makePrismaCategory({
      userId: user.id,
    })
    const category2 = await categoryFactory.makePrismaCategory({
      userId: user.id,
    })
    const reminder = await reminderFactory.makePrismaReminder({
      userId: user.id,
      accountId: account1.id,
      categoryId: category1.id,
      name: 'boleto',
      type: 'spent',
      frequency: 'monthly',
      value: 100,
      description: 'description example',
      date: new Date(2022, 1, 25),
      expires: new Date(2022, 10, 25),
    })

    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const response = await request(app.getHttpServer())
      .put(`/reminder/${reminder.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        user_id: user.id.toValue(),
        account_id: account2.id.toValue(),
        category_id: category2.id.toValue(),
        name: 'salario',
        type: 'deposit',
        frequency: 'monthly',
        value: 3500,
        description: 'description example',
        date: new Date(2022, 1, 10),
        expires: new Date(2027, 1, 10),
      })

    expect(response.statusCode).toBe(200)
    expect(await prisma.reminder.findMany()).toHaveLength(1)
    expect((await prisma.reminder.findFirst()).accountId).toBe(
      account2.id.toValue(),
    )
  })
})
