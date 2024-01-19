import { Either, left, right } from '@/core/either'

import { User } from '../../interprise/entities/user'
import { UserRepository } from '../repositories/user-repository'
import { ResourceAlreadyExistsError } from './errors/resource-already-exists-error'

interface RegisterUserUseCaseRequest {
  name: string
  email: string
}

type RegisterUserUseCaseResponse = Either<ResourceAlreadyExistsError, unknown>

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    name,
    email,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (user) {
      return left(new ResourceAlreadyExistsError('email'))
    }

    const newUser = User.crete({
      email,
      name,
    })

    await this.userRepository.create(newUser)

    return right({})
  }
}
