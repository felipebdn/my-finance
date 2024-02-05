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
import { EnvService } from '@/infra/env/env.service'

describe('List Reminders [e2e]', () => {
  let app: INestApplication
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

    userFactory = moduleRef.get(UserFactory)
    accountFactory = moduleRef.get(AccountFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    reminderFactory = moduleRef.get(ReminderFactory)
    envService = moduleRef.get(EnvService)
    jwt = moduleRef.get(JwtService)

    configureSession(app, envService)

    await app.init()
  })

  test('[GET] /reminders/list - list reminders', async () => {
    const user = await userFactory.makePrismaUser({})
    const account = await accountFactory.makePrismaAccount({
      userId: user.id,
    })
    const category = await categoryFactory.makePrismaCategory({
      userId: user.id,
    })
    const reminder1 = await reminderFactory.makePrismaReminder({
      userId: user.id,
      accountId: account.id,
      categoryId: category.id,
      type: 'deposit',
    })
    await reminderFactory.makePrismaReminder({
      userId: user.id,
      accountId: account.id,
      categoryId: category.id,
      type: 'spent',
    })

    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const response1 = await request(app.getHttpServer())
      .get(`/reminders/list?user_id=${user.id.toValue()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response1.body.reminders).toHaveLength(2)

    const response2 = await request(app.getHttpServer())
      .get(`/reminders/list?user_id=${user.id.toValue()}&type=deposit`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response2.body.reminders).toHaveLength(1)
    expect(response2.body.reminders[0]).toEqual(
      expect.objectContaining({
        id: reminder1.id.toValue(),
      }),
    )
  })
})
