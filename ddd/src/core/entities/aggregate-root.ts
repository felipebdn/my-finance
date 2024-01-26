import { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'
import { Entity } from './entity'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  protected addDomainEvent(domainEvents: DomainEvent): void {
    this._domainEvents.push(domainEvents)
    DomainEvents.markAggregateForDispatch(this)
  }

  public clearEvents() {
    this._domainEvents = []
  }

  public equals(entity: Entity<Props>) {
    if (entity === this) {
      return true
    }
    if (entity.id === this.id) {
      return true
    }

    return false
  }
}
