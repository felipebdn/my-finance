import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-account'
import { CategoryFactory } from 'test/factories/make-category'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('New Deposit [e2e]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let accountFactory: AccountFactory
  let categoryFactory: CategoryFactory
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    accountFactory = moduleRef.get(AccountFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test.skip('[POST] /transactions/deposit', async () => {
    const user = await userFactory.makePrismaUser({})
    const account = await accountFactory.makePrismaAccount({
      userId: user.id,
      value: 100,
    })
    const category = await categoryFactory.makePrismaCategory({
      userId: user.id,
    })

    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const response = await request(app.getHttpServer)
      .post('/transactions/deposit')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        account_id: account.id.toValue(),
        categoryId: category.id.toValue(),
        user_id: user.id.toValue(),
        value: 80.4,
      })

    expect(response.statusCode).toBe(201)

    const transaction = await prisma.transaction.findFirst()

    expect(transaction.value).toBe(180.4)
  })
})
