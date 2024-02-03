import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-account'
import { CategoryFactory } from 'test/factories/make-category'
import { TransactionFactory } from 'test/factories/make-transaction'
import { UserFactory } from 'test/factories/make-user'
import { configureSession } from 'test/utils/test-utils'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { EnvService } from '@/infra/env/env.service'

describe('Get Transaction [e2e]', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let accountFactory: AccountFactory
  let transactionFactory: TransactionFactory
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
        CategoryFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    accountFactory = moduleRef.get(AccountFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    transactionFactory = moduleRef.get(TransactionFactory)
    envService = moduleRef.get(EnvService)
    jwt = moduleRef.get(JwtService)

    configureSession(app, envService)

    await app.init()
  })

  test('[GET] /transaction/:userId/:transactionId - get transaction by id', async () => {
    const user = await userFactory.makePrismaUser({})
    const account = await accountFactory.makePrismaAccount({
      userId: user.id,
      value: 100,
    })
    const category = await categoryFactory.makePrismaCategory({
      type: 'deposit',
      userId: user.id,
    })
    const transaction = await transactionFactory.makePrismaTransaction({
      userId: user.id,
      accountId: account.id,
      categoryId: category.id,
      type: 'deposit',
      value: 515.95,
    })

    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })
    const response = await request(app.getHttpServer())
      .get(`/transaction/${user.id.toValue()}/${transaction.id.toValue()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.transaction).toEqual(
      expect.objectContaining({
        account_id: account.id.toValue(),
        value: 515.95,
      }),
    )
  })
})
