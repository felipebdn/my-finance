import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { Reminder } from '../../enterprise/entities/reminder'
import { typeTransaction } from '../../enterprise/entities/transaction'
import { ReminderRepository } from '../repositories/reminder-repository'

interface ListRemindersUseCaseRequest {
  userId: string
  type?: string
}

type ListRemindersUseCaseResponse = Either<
  unknown,
  {
    reminders: Reminder[]
  }
>

@Injectable()
export class ListRemindersUseCase {
  constructor(private reminderRepository: ReminderRepository) {}

  async execute({
    type,
    userId,
  }: ListRemindersUseCaseRequest): Promise<ListRemindersUseCaseResponse> {
    const reminders = await this.reminderRepository.findManyByUserId(
      userId,
      type as typeTransaction,
    )
    return right({ reminders })
  }
}
