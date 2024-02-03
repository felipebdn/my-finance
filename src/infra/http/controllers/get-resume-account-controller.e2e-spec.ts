import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-account'
import { UserFactory } from 'test/factories/make-user'
import { configureSession } from 'test/utils/test-utils'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { EnvService } from '@/infra/env/env.service'

describe('New Transaction [e2e]', () => {
  let app: INestApplication
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

    userFactory = moduleRef.get(UserFactory)
    accountFactory = moduleRef.get(AccountFactory)
    envService = moduleRef.get(EnvService)
    jwt = moduleRef.get(JwtService)

    configureSession(app, envService)

    await app.init()
  })

  test('[GET] /accounts - get resume of accounts', async () => {
    const user = await userFactory.makePrismaUser({})
    await accountFactory.makePrismaAccount({
      userId: user.id,
      value: 100,
    })
    await accountFactory.makePrismaAccount({
      userId: user.id,
      value: 50.74,
    })

    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })
    const response = await request(app.getHttpServer())
      .get(`/accounts/${user.id.toValue()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        value: 150.74,
      }),
    )
  })
})
