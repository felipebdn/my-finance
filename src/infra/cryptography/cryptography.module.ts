import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/finance/application/cryptography/encrypter'

import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [{ provide: Encrypter, useClass: JwtEncrypter }],
  exports: [Encrypter],
})
export class CryptographyModule {}
