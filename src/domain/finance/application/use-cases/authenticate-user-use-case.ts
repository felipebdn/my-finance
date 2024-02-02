import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { User } from '../../enterprise/entities/user'
import { Encrypter } from '../cryptography/encrypter'
import { UserRepository } from '../repositories/user-repository'

interface AuthenticateUserUseCaseRequest {
  name: string
  email: string
  avatarUrl: string
  googleId: string
}

type AuthenticateUserUseCaseResponse = Either<
  unknown,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    name,
    email,
    avatarUrl,
    googleId,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (user) {
      user.avatarUrl = avatarUrl
      user.googleId = googleId
      user.name = name

      await this.userRepository.save(user)

      return right({
        accessToken: await this.encrypter.encrypt({
          sub: user.id.toValue(),
        }),
      })
    } else {
      const newUser = User.create({
        googleId,
        avatarUrl,
        email,
        name,
      })

      await this.userRepository.create(newUser)

      return right({
        accessToken: await this.encrypter.encrypt({
          sub: newUser.id.toValue(),
        }),
      })
    }
  }
}
