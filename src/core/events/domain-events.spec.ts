import { Entity } from '../entities/entity'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomEntityCreated implements DomainEvent {
  public ocurredAt: Date
  // eslint-disable-next-line no-use-before-define
  private entity: CustomEntity

  constructor(entity: CustomEntity) {
    this.ocurredAt = new Date()
    this.entity = entity
  }

  public getAggregateId(): UniqueEntityId {
    return this.entity.id
  }
}

class CustomEntity extends Entity<null> {
  static create() {
    const entity = new CustomEntity(null)

    entity.addDomainEvent(new CustomEntityCreated(entity))

    return entity
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // Subscriber cadastrado
    DomainEvents.register(callbackSpy, CustomEntityCreated.name)

    // criando entity SEM salvar no banco
    const entity = CustomEntity.create()

    // Assegurando que o evento foi criado e não foi disparado
    expect(entity.domainEvents).toHaveLength(1)

    // Salvando a entity no banco e disparando o evento
    DomainEvents.dispatchEventsForEntity(entity.id)

    // Subscriber ouve o evento e faz o que deve ser feito
    expect(callbackSpy).toHaveBeenCalled()
    expect(entity.domainEvents).toHaveLength(0)
  })
})
