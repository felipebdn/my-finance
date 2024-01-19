import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AccountProps {
  userId: UniqueEntityId
  name: string
  value: number
  createdAt: Date
  updateAt?: Date
}

export class Account extends Entity<AccountProps> {
  get userId() {
    return this.props.userId
  }

  get name() {
    return this.props.name
  }

  get value() {
    return this.props.value
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updateAt() {
    return this.props.updateAt
  }

  public Deposit(value: number) {
    this.props.value = this.props.value + value
  }

  public Spent(value: number) {
    this.props.value = this.props.value - value
  }

  static create(
    props: Optional<AccountProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const account = new Account(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return account
  }
}