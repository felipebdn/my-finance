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

describe('List Transactions By Type [e2e]', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let accountFactory: AccountFactory
  let categoryFactory: CategoryFactory
  let transactionFactory: TransactionFactory
  let envService: EnvService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        AccountFactory,
        CategoryFactory,
        TransactionFactory,
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

  test('[GET] /transactions/list - list transactions by type', async () => {
    const user = await userFactory.makePrismaUser({})
    const account1 = await accountFactory.makePrismaAccount({
      userId: user.id,
    })
    const account2 = await accountFactory.makePrismaAccount({
      userId: user.id,
    })
    const category = await categoryFactory.makePrismaCategory({
      userId: user.id,
    })
    await transactionFactory.makePrismaTransaction({
      userId: user.id,
      accountId: account1.id,
      categoryId: category.id,
      type: 'deposit',
      date: new Date(2022, 1, 10),
    })
    await transactionFactory.makePrismaTransaction({
      userId: user.id,
      accountId: account2.id,
      categoryId: category.id,
      type: 'deposit',
      date: new Date(2022, 1, 15),
    })

    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const userId = user.id.toString()
    const account1Id = account1.id.toString()

    const response1 = await request(app.getHttpServer())
      .get(
        `/transactions/list?type=deposit&user_id=${userId}&in_date=${new Date(2022, 1, 9)}&out_date=${new Date(2022, 1, 16)}`,
      )
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response1.body.transactions).toHaveLength(2)

    const response2 = await request(app.getHttpServer())
      .get(
        `/transactions/list?type=deposit&user_id=${userId}&in_date=${new Date(2022, 1, 9)}&out_date=${new Date(2022, 1, 16)}&account_id=${account1Id}`,
      )
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response2.body.transactions).toHaveLength(1)
  })
})
