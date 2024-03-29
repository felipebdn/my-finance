import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { FrequencyType } from '../../enterprise/entities/reminder'
import { typeTransaction } from '../../enterprise/entities/transaction'
import { AccountRepository } from '../repositories/account-repository'
import { CategoryRepository } from '../repositories/category-repository'
import { ReminderRepository } from '../repositories/reminder-repository'

interface EditReminderUseCaseRequest {
  reminderId: string
  userId: string
  accountId: string
  categoryId: string
  name: string
  type: string
  frequency: string
  value: number
  description?: string
  date: Date
  expires: Date
}

type EditReminderUseCaseResponse = Either<
  ResourceAlreadyExistsError | NotAllowedError,
  unknown
>

@Injectable()
export class EditReminderUseCase {
  constructor(
    private reminderRepository: ReminderRepository,
    private accountRepository: AccountRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async execute({
    reminderId,
    accountId,
    categoryId,
    date,
    expires,
    frequency,
    name,
    type,
    userId,
    value,
    description,
  }: EditReminderUseCaseRequest): Promise<EditReminderUseCaseResponse> {
    const reminder = await this.reminderRepository.findById(reminderId)
    const account = await this.accountRepository.findById(accountId)
    const category = await this.categoryRepository.findById(categoryId)

    if (!reminder || !account || !category) {
      return left(new ResourceNotFoundError())
    }

    if (
      account.userId.toValue() !== userId ||
      category.userId.toValue() !== userId
    ) {
      return left(new NotAllowedError())
    }

    reminder.categoryId = new UniqueEntityId(categoryId)
    reminder.accountId = new UniqueEntityId(accountId)
    reminder.date = date
    reminder.expires = expires
    reminder.frequency = frequency as FrequencyType
    reminder.name = name
    reminder.value = value
    reminder.description = description
    reminder.type = type as typeTransaction

    reminder.touch()

    await this.reminderRepository.save(reminder)

    return right({})
  }
}
