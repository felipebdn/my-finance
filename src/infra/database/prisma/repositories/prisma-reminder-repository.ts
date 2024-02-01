import { Injectable } from '@nestjs/common'

import { ReminderRepository } from '@/domain/finance/application/repositories/reminder-repository'
import { Reminder } from '@/domain/finance/enterprise/entities/reminder'
import { typeTransaction } from '@/domain/finance/enterprise/entities/transaction'

import { PrismaReminderMapper } from '../mappers/prisma-reminder-mapper'
import { PrismaClientManager, PrismaService } from '../prisma.service'

@Injectable()
export class PrismaReminderRepository implements ReminderRepository {
  constructor(
    private prisma: PrismaService,
    private clientManager: PrismaClientManager,
  ) {}

  private getPrisma(tKey?: string) {
    return tKey ? this.clientManager.getClient(tKey) : this.prisma
  }

  async create(reminder: Reminder, t?: string): Promise<void> {
    const prisma = this.getPrisma(t)
    await prisma.reminder.create({
      data: PrismaReminderMapper.toPrisma(reminder),
    })
  }

  async save(reminder: Reminder, t?: string): Promise<void> {
    const prisma = this.getPrisma(t)
    await prisma.reminder.update({
      data: PrismaReminderMapper.toPrisma(reminder),
      where: {
        id: reminder.id.toValue(),
      },
    })
  }

  async findById(id: string, t?: string): Promise<Reminder> {
    const prisma = this.getPrisma(t)
    const reminder = await prisma.reminder.findUnique({
      where: {
        id,
      },
    })
    if (!reminder) {
      return null
    }
    return PrismaReminderMapper.toDomain(reminder)
  }

  async findManyByUserId(
    userId: string,
    type?: typeTransaction,
    t?: string,
  ): Promise<Reminder[]> {
    const prisma = this.getPrisma(t)
    const reminders = await prisma.reminder.findMany({
      where: {
        AND: [
          { userId },
          {
            type: {
              equals: type,
            },
          },
        ],
      },
    })
    return reminders.map(PrismaReminderMapper.toDomain)
  }

  async deleteManyByCategoryId(categoryId: string, t?: string): Promise<void> {
    const prisma = this.getPrisma(t)
    await prisma.reminder.deleteMany({
      where: {
        categoryId,
      },
    })
  }

  async deleteManyByAccountId(accountId: string, t?: string): Promise<void> {
    const prisma = this.getPrisma(t)
    await prisma.reminder.deleteMany({
      where: {
        accountId,
      },
    })
  }

  async deleteById(reminder: Reminder, t?: string): Promise<void> {
    const prisma = this.getPrisma(t)
    await prisma.reminder.delete({
      where: {
        id: reminder.id.toValue(),
      },
    })
  }
}
