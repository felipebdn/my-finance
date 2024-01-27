import { ReminderRepository } from '@/domain/finance/application/repositories/reminder-repository'
import { Reminder } from '@/domain/finance/enterprise/entities/reminder'
import { typeTransaction } from '@/domain/finance/enterprise/entities/transaction'

import { PrismaReminderMapper } from '../mappers/prisma-reminder-mapper'
import { PrismaService } from '../prisma/prisma.service'

export class PrismaReminderRepository implements ReminderRepository {
  constructor(private prisma: PrismaService) {}

  async create(reminder: Reminder): Promise<void> {
    await this.prisma.reminder.create({
      data: PrismaReminderMapper.toPrisma(reminder),
    })
  }

  async save(reminder: Reminder): Promise<void> {
    await this.prisma.reminder.update({
      data: PrismaReminderMapper.toPrisma(reminder),
      where: {
        id: reminder.id.toValue(),
      },
    })
  }

  async findById(id: string): Promise<Reminder> {
    const reminder = await this.prisma.reminder.findUnique({
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
  ): Promise<Reminder[]> {
    const reminders = await this.prisma.reminder.findMany({
      where: {
        userId,
        type: {
          equals: type,
        },
      },
    })
    return reminders.map((reminder) => PrismaReminderMapper.toDomain(reminder))
  }

  async deleteManyByCategoryId(categoryId: string): Promise<void> {
    await this.prisma.reminder.deleteMany({
      where: {
        categoryId,
      },
    })
  }

  async deleteManyByAccountId(accountId: string): Promise<void> {
    await this.prisma.reminder.deleteMany({
      where: {
        accountId,
      },
    })
  }

  async deleteById(reminder: Reminder): Promise<void> {
    await this.prisma.reminder.delete({
      where: {
        id: reminder.id.toValue(),
      },
    })
  }
}
