import { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'
import { UniqueEntityId } from './unique-entity-id'

export abstract class Entity<T> {
  private _id: UniqueEntityId
  protected props: T

  private _domainEvents: DomainEvent[] = []

  constructor(props: T, id?: UniqueEntityId) {
    this.props = props
    this._id = id ?? new UniqueEntityId()
  }

  get id() {
    return this._id
  }

  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  protected addDomainEvent(domainEvents: DomainEvent): void {
    this._domainEvents.push(domainEvents)
    DomainEvents.markEntityForDispatch(this)
  }

  public clearEvents() {
    this._domainEvents = []
  }

  public equals(entity: Entity<any>) {
    if (entity === this) {
      return true
    }
    if (entity.id === this.id) {
      return true
    }

    return false
  }
}
