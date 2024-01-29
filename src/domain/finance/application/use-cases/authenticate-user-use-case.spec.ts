import { FakeEncrypter } from 'test/cryptography/encrypter'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { expect } from 'vitest'

import { AuthenticateUserUseCase } from './authenticate-user-use-case'

let inMemoryUserRepository: InMemoryUserRepository
let encrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    encrypter = new FakeEncrypter()
    sut = new AuthenticateUserUseCase(inMemoryUserRepository, encrypter)
  })

  it('should be able to authenticate a user', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      avatarUrl: 'avatarUrl',
      googleId: '01',
    })
    expect(result.isRight()).toBeTruthy()
    expect(inMemoryUserRepository.items[0].email).toBe('johndoe@example.com')

    if (result.isRight()) {
      expect(result.value.accessToken).toBeTruthy()
    }
  })
  it('should be able to authenticate a user already exists', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      avatarUrl: 'url-01',
    })
    inMemoryUserRepository.items.push(user)
    expect(inMemoryUserRepository.items[0].avatarUrl).toBe('url-01')
    const result = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      avatarUrl: 'url-02',
      googleId: '01',
    })
    expect(result.isRight()).toBeTruthy()
    expect(inMemoryUserRepository.items[0].avatarUrl).toBe('url-02')

    if (result.isRight()) {
      expect(result.value.accessToken).toBeTruthy()
    }
  })
})
