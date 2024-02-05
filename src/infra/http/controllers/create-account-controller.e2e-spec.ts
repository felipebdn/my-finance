import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'
import { configureSession } from 'test/utils/test-utils'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'

describe('New Account [e2e]', () => {
  let prisma: PrismaService
  let app: INestApplication
  let userFactory: UserFactory
  let envService: EnvService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    envService = moduleRef.get(EnvService)
    jwt = moduleRef.get(JwtService)

    configureSession(app, envService)

    await app.init()
  })

  test('[POST] /accounts/new - new account', async () => {
    const user = await userFactory.makePrismaUser({})

    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const response = await request(app.getHttpServer())
      .post('/accounts/new')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'default',
        value: 1500,
        user_id: user.id.toValue(),
      })

    expect(response.statusCode).toBe(201)
    expect((await prisma.account.findFirst()).name).toBe('default')
  })
})
