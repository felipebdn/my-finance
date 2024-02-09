import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-account'
import { CategoryFactory } from 'test/factories/make-category'
import { TransactionFactory } from 'test/factories/make-transaction'
import { UserFactory } from 'test/factories/make-user'
import { configureSession } from 'test/utils/test-utils'

import { Account } from '@/domain/finance/enterprise/entities/account'
import { Category } from '@/domain/finance/enterprise/entities/category'
import { User } from '@/domain/finance/enterprise/entities/user'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'

describe('Edit Transaction [e2e]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let accountFactory: AccountFactory
  let categoryFactory: CategoryFactory
  let transactionFactory: TransactionFactory
  let envService: EnvService
  let jwt: JwtService

  let user: User
  let account: Account
  let depositCategory: Category
  let accessToken: string

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

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    accountFactory = moduleRef.get(AccountFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    transactionFactory = moduleRef.get(TransactionFactory)
    envService = moduleRef.get(EnvService)
    jwt = moduleRef.get(JwtService)

    user = await userFactory.makePrismaUser({})
    account = await accountFactory.makePrismaAccount({
      userId: user.id,
      value: 100,
    })
    depositCategory = await categoryFactory.makePrismaCategory({
      userId: user.id,
      type: 'deposit',
    })

    accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    configureSession(app, envService)

    await app.init()
  })

  test('[PUT] /transactions/:transactionId - deposit / deposit', async () => {
    const transaction = await transactionFactory.makePrismaTransaction({
      accountId: account.id,
      categoryId: depositCategory.id,
      userId: user.id,
      type: 'deposit',
      value: 20,
    })

    const response = await request(app.getHttpServer())
      .put(`/transactions/${transaction.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        account_id: account.id.toValue(),
        category_id: depositCategory.id.toValue(),
        user_id: user.id.toValue(),
        type: 'deposit',
        value: 30,
        date: transaction.date,
      })

    expect(response.statusCode).toBe(200)

    const accountPrisma = await prisma.account.findUnique({
      where: {
        id: account.id.toValue(),
      },
    })

    expect(accountPrisma.value).toEqual(110)
  })
  test('[PUT] /transactions/:transactionId - deposit / spent', async () => {
    const transaction = await transactionFactory.makePrismaTransaction({
      accountId: account.id,
      categoryId: depositCategory.id,
      userId: user.id,
      type: 'deposit',
      value: 20,
    })

    const response = await request(app.getHttpServer())
      .put(`/transactions/${transaction.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        account_id: account.id.toValue(),
        category_id: depositCategory.id.toValue(),
        user_id: user.id.toValue(),
        type: 'spent',
        value: 30,
        date: transaction.date,
      })

    expect(response.statusCode).toBe(200)

    const accountPrisma = await prisma.account.findUnique({
      where: {
        id: account.id.toValue(),
      },
    })

    expect(accountPrisma.value).toEqual(50)
  })
  test('[PUT] /transactions/:transactionId - spent / spent', async () => {
    const transaction = await transactionFactory.makePrismaTransaction({
      accountId: account.id,
      categoryId: depositCategory.id,
      userId: user.id,
      type: 'spent',
      value: 20,
    })

    const response = await request(app.getHttpServer())
      .put(`/transactions/${transaction.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        account_id: account.id.toValue(),
        category_id: depositCategory.id.toValue(),
        user_id: user.id.toValue(),
        type: 'spent',
        value: 10,
        date: transaction.date,
      })

    expect(response.statusCode).toBe(200)

    const accountPrisma = await prisma.account.findUnique({
      where: {
        id: account.id.toValue(),
      },
    })

    expect(accountPrisma.value).toEqual(110)
  })
  test('[PUT] /transactions/:transactionId - spent / deposit', async () => {
    const transaction = await transactionFactory.makePrismaTransaction({
      accountId: account.id,
      categoryId: depositCategory.id,
      userId: user.id,
      type: 'spent',
      value: 20,
    })

    const response = await request(app.getHttpServer())
      .put(`/transactions/${transaction.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        account_id: account.id.toValue(),
        category_id: depositCategory.id.toValue(),
        user_id: user.id.toValue(),
        type: 'deposit',
        value: 10,
        date: transaction.date,
      })

    expect(response.statusCode).toBe(200)

    const accountPrisma = await prisma.account.findUnique({
      where: {
        id: account.id.toValue(),
      },
    })

    expect(accountPrisma.value).toEqual(130)
  })
})
