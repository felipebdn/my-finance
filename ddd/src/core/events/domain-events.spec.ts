/* eslint-disable no-use-before-define */
import { expect } from 'vitest'

import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomEntityCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate

  constructor(entity: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = entity
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomEntityCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // Subscriber cadastrado
    DomainEvents.register(callbackSpy, CustomEntityCreated.name)

    // criando entity SEM salvar no banco
    const aggregate = CustomAggregate.create()

    // Assegurando que o evento foi criado e não foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // Salvando a aggregate no banco e disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // Subscriber ouve o evento e faz o que deve ser feito
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
