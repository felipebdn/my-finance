import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { ReminderRepository } from '../repositories/reminder-repository'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteReminderUseCaseRequest {
  userId: string
  reminderId: string
}

type DeleteReminderUseCaseResponse = Either<unknown, unknown>

export class DeleteReminderUseCase {
  constructor(private reminderRepository: ReminderRepository) {}

  async execute({
    reminderId,
    userId,
  }: DeleteReminderUseCaseRequest): Promise<DeleteReminderUseCaseResponse> {
    const reminder = await this.reminderRepository.findById(reminderId)
    if (!reminder) {
      return left(new ResourceNotFoundError('reminder'))
    }
    if (reminder.userId.toValue() !== userId) {
      return left(new NotAllowedError())
    }

    await this.reminderRepository.deleteById(reminder)

    return right({})
  }
}
