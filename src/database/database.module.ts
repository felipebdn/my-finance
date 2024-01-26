import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaUserRepositories } from './prisma/repositories/prisma-user-repositories'

@Module({
  providers: [PrismaService, PrismaUserRepositories],
  exports: [PrismaService, PrismaUserRepositories],
})
export class DatabaseModule {}
