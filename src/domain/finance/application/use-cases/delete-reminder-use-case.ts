import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { ReminderRepository } from '../repositories/reminder-repository'

interface DeleteReminderUseCaseRequest {
  userId: string
  reminderId: string
}

type DeleteReminderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  unknown
>

@Injectable()
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
