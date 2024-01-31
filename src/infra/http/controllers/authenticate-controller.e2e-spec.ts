import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'

vi.mock('@/infra/auth/utils-google/GoogleStrategy', () => ({
  GoogleStrategy: vi.fn(),
}))

describe('Authenticate Controller [e2e]', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  test.skip('[GET] /auth', async () => {
    const response = await request(app.getHttpServer()).get('/auth')
    console.log(response)
  })
})
