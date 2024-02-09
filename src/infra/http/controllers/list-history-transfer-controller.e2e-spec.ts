import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-account'
import { TransferFactory } from 'test/factories/make-transfer'
import { UserFactory } from 'test/factories/make-user'
import { configureSession } from 'test/utils/test-utils'

import { Account } from '@/domain/finance/enterprise/entities/account'
import { Transfer } from '@/domain/finance/enterprise/entities/transfer'
import { User } from '@/domain/finance/enterprise/entities/user'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'

describe('List Transfer History [e2e]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let accountFactory: AccountFactory
  let transferFactory: TransferFactory
  let envService: EnvService
  let jwt: JwtService

  let user: User
  let account1: Account
  let account2: Account
  let account3: Account
  let transfer1: Transfer
  let transfer2: Transfer
  let transfer3: Transfer
  let accessToken: string

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

  test('[POST] /transactions - new deposit', async () => {
    user = await userFactory.makePrismaUser({})

    account1 = await accountFactory.makePrismaAccount({
      userId: user.id,
    })
    account2 = await accountFactory.makePrismaAccount({
      userId: user.id,
    })
    account3 = await accountFactory.makePrismaAccount({
      userId: user.id,
    })

    transfer1 = await transferFactory.makePrismaTransfer({
      userId: user.id,
      referentId: account1.id,
      destinyId: account2.id,
      date: new Date(2022, 5, 10),
    })
    transfer2 = await transferFactory.makePrismaTransfer({
      userId: user.id,
      referentId: account2.id,
      destinyId: account3.id,
      date: new Date(2022, 5, 12),
    })
    transfer3 = await transferFactory.makePrismaTransfer({
      userId: user.id,
      referentId: account1.id,
      destinyId: account3.id,
      date: new Date(2022, 5, 14),
    })

    accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const response1 = await request(app.getHttpServer())
      .get('/transfer/list')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        user_id: user.id.toValue(),
        id_date: new Date(2022, 5, 9),
        until_date: new Date(2022, 5, 15),
        accounts_ids: [
          account1.id.toValue(),
          account2.id.toValue(),
          account3.id.toValue(),
        ],
      })

    expect(response1.body.transfers).toHaveLength(3)

    const response2 = await request(app.getHttpServer())
      .get('/transfer/list')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        user_id: user.id.toValue(),
        id_date: new Date(2022, 5, 9),
        until_date: new Date(2022, 5, 15),
        accounts_ids: [account1.id.toValue(), account3.id.toValue()],
      })

    expect(response2.body.transfers).toHaveLength(3)

    const response3 = await request(app.getHttpServer())
      .get('/transfer/list')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        user_id: user.id.toValue(),
        id_date: new Date(2022, 5, 9),
        until_date: new Date(2022, 5, 15),
        accounts_ids: [account1.id.toValue()],
      })

    expect(response3.body.transfers).toHaveLength(2)

    const response4 = await request(app.getHttpServer())
      .get('/transfer/list')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        user_id: user.id.toValue(),
        id_date: new Date(2022, 5, 9),
        until_date: new Date(2022, 5, 13),
        accounts_ids: [account1.id.toValue()],
      })

    expect(response4.body.transfers).toHaveLength(1)
  })
})
