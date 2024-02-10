import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-account'
import { TransferFactory } from 'test/factories/make-transfer'
import { UserFactory } from 'test/factories/make-user'
import { configureSession } from 'test/utils/test-utils'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'

describe('Delete Transfer [e2e]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let accountFactory: AccountFactory
  let transferFactory: TransferFactory
  let envService: EnvService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, AccountFactory, TransferFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    accountFactory = moduleRef.get(AccountFactory)
    transferFactory = moduleRef.get(TransferFactory)
    envService = moduleRef.get(EnvService)
    jwt = moduleRef.get(JwtService)

    configureSession(app, envService)

    await app.init()
  })

  test('[POST] /transfer/:transferId/:userId - delete transfer', async () => {
    const user = await userFactory.makePrismaUser({})

    const account1 = await accountFactory.makePrismaAccount({
      userId: user.id,
      value: 100,
    })
    const account2 = await accountFactory.makePrismaAccount({
      userId: user.id,
      value: 100,
    })

    const transfer = await transferFactory.makePrismaTransfer({
      userId: user.id,
      destinyId: account2.id,
      referentId: account1.id,
    })

    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const response = await request(app.getHttpServer())
      .delete(`/transfer/${transfer.id.toString()}/${user.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)
    expect((await prisma.transfer.findMany()).length).toBe(0)
  })
})
