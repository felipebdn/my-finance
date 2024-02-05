import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { UserFactory } from 'test/factories/make-user'
import { configureSession } from 'test/utils/test-utils'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'

describe('Edit Category [e2e]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let categoryFactory: CategoryFactory
  let envService: EnvService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    envService = moduleRef.get(EnvService)
    jwt = moduleRef.get(JwtService)

    configureSession(app, envService)

    await app.init()
  })

  test('[POST] /category/update - edit category', async () => {
    const user = await userFactory.makePrismaUser({})
    const category = await categoryFactory.makePrismaCategory({
      userId: user.id,
      name: 'comida',
      type: 'spent',
    })
    const accessToken = jwt.sign({
      sub: user.id.toValue(),
    })

    const response = await request(app.getHttpServer())
      .post('/category/update')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        category_id: category.id.toValue(),
        user_id: user.id.toValue(),
        type: 'deposit',
        name: 'salario',
      })

    expect(response.statusCode).toBe(201)

    expect((await prisma.category.findFirst()).name).toBe('salario')
    expect((await prisma.category.findFirst()).type).toBe('deposit')
  })
})
