import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-account'
import { CategoryFactory } from 'test/factories/make-category'
import { UserFactory } from 'test/factories/make-user'
import { configureSession } from 'test/utils/test-utils'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'

describe('New Reminder [e2e]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let accountFactory: AccountFactory
  let categoryFactory: CategoryFactory
  let envService: EnvService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, AccountFactory, CategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    accountFactory = moduleRef.get(AccountFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    envService = moduleRef.get(EnvService)
    jwt = moduleRef.get(JwtService)

    configureSession(app, envService)

    await app.init()
  })

  test('[POST] /reminder/new - new reminder', async () => {
    const user = await userFactory.makePrismaUser({})

    const account = await accountFactory.makePrismaAccount({
      userId: user.id,
    })
    const category = await categoryFactory.makePrismaCategory({
      userId: user.id,
    })

    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const response = await request(app.getHttpServer())
      .post('/reminder/new')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        user_id: user.id.toValue(),
        account_id: account.id.toValue(),
        category_id: category.id.toValue(),
        name: 'boleto',
        type: 'spent',
        frequency: 'monthly',
        value: 100,
        description: 'description example',
        date: new Date(2022, 1, 25),
        expires: new Date(2022, 10, 25),
      })

    expect(response.statusCode).toBe(201)
    expect(await prisma.reminder.findMany()).toHaveLength(1)
  })
})
