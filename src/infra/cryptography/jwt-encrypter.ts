import { JwtService } from '@nestjs/jwt'

import { Encrypter } from '@/domain/finance/application/cryptography/encrypter'

export class JwtEncrypter implements Encrypter {
  constructor(private jwt: JwtService) {}

  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwt.signAsync(payload)
  }
}
