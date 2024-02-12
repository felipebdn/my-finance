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
    const category1 = await categoryFactory.makePrismaCategory({
      userId: user.id,
    })
    const category2 = await categoryFactory.makePrismaCategory({
      userId: user.id,
    })

    await transactionFactory.makePrismaTransaction({
      accountId: account1.id,
      userId: user.id,
      categoryId: category1.id,
      type: 'deposit',
    })
    await transactionFactory.makePrismaTransaction({
      accountId: account1.id,
      userId: user.id,
      categoryId: category2.id,
      type: 'deposit',
    })
    await transactionFactory.makePrismaTransaction({
      accountId: account2.id,
      userId: user.id,
      categoryId: category1.id,
      type: 'deposit',
    })
    await transactionFactory.makePrismaTransaction({
      accountId: account2.id,
      userId: user.id,
      categoryId: category2.id,
      type: 'spent',
    })

    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const result1 = await request(app.getHttpServer())
      .get('/transactions/category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        type: 'deposit',
        category_id: category1.id.toValue(),
        user_id: user.id.toValue(),
        account_ids: [account1.id.toValue()],
      })
    expect(result1.body.transactions).toHaveLength(1)

    const result2 = await request(app.getHttpServer())
      .get('/transactions/category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        type: 'spent',
        category_id: category2.id.toValue(),
        user_id: user.id.toValue(),
        account_ids: [account2.id.toValue()],
      })
    expect(result2.body.transactions).toHaveLength(1)
  })
})
