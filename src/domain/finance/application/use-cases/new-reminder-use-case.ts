import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { FrequencyType, Reminder } from '../../enterprise/entities/reminder'
import { typeTransaction } from '../../enterprise/entities/transaction'
import { AccountRepository } from '../repositories/account-repository'
import { CategoryRepository } from '../repositories/category-repository'
import { ReminderRepository } from '../repositories/reminder-repository'

interface NewReminderUseCaseRequest {
  userId: string
  accountId: string
  categoryId: string
  name: string
  type: string
  frequency: string
  value: number
  description: string
  date: Date
  expires: Date
}

type NewReminderUseCaseResponse = Either<
  ResourceAlreadyExistsError | NotAllowedError,
  unknown
>

@Injectable()
export class NewReminderUseCase {
  constructor(
    private reminderRepository: ReminderRepository,
    private accountRepository: AccountRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async execute({
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
  }: NewReminderUseCaseRequest): Promise<NewReminderUseCaseResponse> {
    const account = await this.accountRepository.findById(accountId)
    const category = await this.categoryRepository.findById(categoryId)

    if (!account || !category) {
      return left(new ResourceNotFoundError())
    }

    if (
      account.userId.toValue() !== userId ||
      category.userId.toValue() !== userId
    ) {
      return left(new NotAllowedError())
    }

    const reminder = Reminder.create({
      accountId: new UniqueEntityId(accountId),
      categoryId: new UniqueEntityId(categoryId),
      expires,
      frequency: frequency as FrequencyType,
      name,
      type: type as typeTransaction,
      userId: new UniqueEntityId(userId),
      value,
      description,
      date,
    })

    this.reminderRepository.create(reminder)

    return right({})
  }
}
