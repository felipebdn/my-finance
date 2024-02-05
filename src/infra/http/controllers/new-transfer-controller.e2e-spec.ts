import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-account'
import { UserFactory } from 'test/factories/make-user'
import { configureSession } from 'test/utils/test-utils'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'

describe('New Transaction [e2e]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let accountFactory: AccountFactory
  let envService: EnvService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, AccountFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    accountFactory = moduleRef.get(AccountFactory)
    envService = moduleRef.get(EnvService)
    jwt = moduleRef.get(JwtService)

    configureSession(app, envService)

    await app.init()
  })

  test('[POST] /transactions - new deposit', async () => {
    const user = await userFactory.makePrismaUser({})

    const account1 = await accountFactory.makePrismaAccount({
      userId: user.id,
      value: 100,
    })
    const account2 = await accountFactory.makePrismaAccount({
      userId: user.id,
      value: 100,
    })

    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const response = await request(app.getHttpServer())
      .post('/transfer/new')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        user_id: user.id.toValue(),
        destiny_id: account2.id.toValue(),
        referent_id: account1.id.toValue(),
        value: 50.46,
        description: 'transfer to another account',
      })

    expect(response.statusCode).toBe(201)

    expect(
      (
        await prisma.account.findUnique({
          where: { id: account1.id.toValue() },
        })
      ).value,
    ).toEqual(49.54)
    expect(
      (
        await prisma.account.findUnique({
          where: { id: account2.id.toValue() },
        })
      ).value,
    ).toEqual(150.46)
    expect(await prisma.transfer.findMany()).toHaveLength(1)
  })
})
