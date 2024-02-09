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

describe('Edit Account [e2e]', () => {
  let prisma: PrismaService
  let app: INestApplication
  let userFactory: UserFactory
  let accountRepository: AccountFactory
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
    accountRepository = moduleRef.get(AccountFactory)
    envService = moduleRef.get(EnvService)
    jwt = moduleRef.get(JwtService)

    configureSession(app, envService)

    await app.init()
  })

  test('[PUT] /accounts/:accountId - edit account', async () => {
    const user = await userFactory.makePrismaUser({})
    const account = await accountRepository.makePrismaAccount({
      name: 'account name',
      userId: user.id,
      value: 100,
    })

    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const response = await request(app.getHttpServer())
      .put(`/accounts/${account.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'default',
        value: 1500,
        user_id: user.id.toValue(),
      })

    expect(response.statusCode).toBe(200)
    expect((await prisma.account.findFirst()).name).toBe('default')
    expect((await prisma.account.findFirst()).value).toBe(1500)
  })
})
