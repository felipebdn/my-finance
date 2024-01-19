import { UniqueEntityId } from './unique-entity-id'

export abstract class Entity<T> {
  private _id: UniqueEntityId
  protected props: T

  get id() {
    return this._id
  }

  constructor(props: T, id?: UniqueEntityId) {
    this.props = props
    this._id = id ?? new UniqueEntityId()
  }
}
