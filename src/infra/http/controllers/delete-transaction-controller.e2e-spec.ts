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
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'

describe('Delete Transaction [e2e]', () => {
  let app: INestApplication
  let prisma: PrismaService
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

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    accountFactory = moduleRef.get(AccountFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    transactionFactory = moduleRef.get(TransactionFactory)
    envService = moduleRef.get(EnvService)
    jwt = moduleRef.get(JwtService)

    configureSession(app, envService)

    await app.init()
  })

  test('[DELETE] /transactions/:transactionId - delete transaction', async () => {
    const user = await userFactory.makePrismaUser({})
    const account = await accountFactory.makePrismaAccount({
      userId: user.id,
      value: 100,
    })
    const depositCategory = await categoryFactory.makePrismaCategory({
      userId: user.id,
      type: 'deposit',
    })

    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const transaction = await transactionFactory.makePrismaTransaction({
      accountId: account.id,
      categoryId: depositCategory.id,
      userId: user.id,
      type: 'deposit',
      value: 20,
    })

    const response = await request(app.getHttpServer())
      .delete(
        `/transactions/${transaction.id.toString()}/${user.id.toString()}`,
      )
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const accountPrisma = await prisma.transaction.findMany()

    expect(accountPrisma.length).toEqual(0)
  })
})
