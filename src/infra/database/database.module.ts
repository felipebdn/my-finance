import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { UserRepository } from '@/domain/finance/application/repositories/user-repository'

import { PrismaClientManager, PrismaService } from './prisma/prisma.service'
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository'

@Module({
  providers: [
    PrismaService,
    PrismaClient,
    PrismaClientManager,
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
  exports: [PrismaService, UserRepository, PrismaClientManager],
})
export class DatabaseModule {}
