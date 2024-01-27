import { Injectable } from '@nestjs/common'

import { AccountRepository } from '@/domain/finance/application/repositories/account-repository'
import { Account } from '@/domain/finance/enterprise/entities/account'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private prisma: PrismaService) {}

  async create(account: Account): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async save(account: Account): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<Account> {
    throw new Error('Method not implemented.')
  }

  async findByName(name: string): Promise<Account> {
    throw new Error('Method not implemented.')
  }

  async findManyByUserId(userId: string): Promise<Account[]> {
    throw new Error('Method not implemented.')
  }

  delete(account: Account): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
