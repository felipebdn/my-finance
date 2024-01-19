import { Either, right } from '@/core/either'

import { Reminder } from '../../interprise/entities/reminder'
import { typeTransaction } from '../../interprise/entities/transaction'
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
