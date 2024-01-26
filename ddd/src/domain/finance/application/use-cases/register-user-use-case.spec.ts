import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { expect } from 'vitest'

import { RegisterUserUseCase } from './register-user-use-case'

let inMemoryUserRepository: InMemoryUserRepository
let sut: RegisterUserUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new RegisterUserUseCase(inMemoryUserRepository)
  })

  it('should be able to create a new category', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
    })
    expect(result.isRight()).toBeTruthy()
    expect(inMemoryUserRepository.items[0].email).toBe('johndoe@example.com')
  })
})
