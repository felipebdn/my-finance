import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Entity } from '../entities/entity'
import { DomainEvent } from './domain-event'

type DomainEventCallback = (event: any) => void

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {}
  private static markedEntitys: Entity<any>[] = []

  public static markEntityForDispatch(entity: Entity<any>) {
    const entityFound = !!this.findMarkedEntityByID(entity.id)

    if (!entityFound) {
      this.markedEntitys.push(entity)
    }
  }

  private static dispatchEntityEvents(entity: Entity<any>) {
    entity.domainEvents.forEach((event: DomainEvent) => this.dispatch(event))
  }

  private static removeEntityFromMarkedDispatchList(entity: Entity<any>) {
    const index = this.markedEntitys.findIndex((a) => a.equals(entity))

    this.markedEntitys.splice(index, 1)
  }

  private static findMarkedEntityByID(
    id: UniqueEntityId,
  ): Entity<any> | undefined {
    return this.markedEntitys.find((entity) => entity.id.equals(id))
  }

  public static dispatchEventsForEntity(id: UniqueEntityId) {
    const entity = this.findMarkedEntityByID(id)

    if (entity) {
      this.dispatchEntityEvents(entity)
      entity.clearEvents()
      this.removeEntityFromMarkedDispatchList(entity)
    }
  }

  public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = []
    }

    this.handlersMap[eventClassName].push(callback)
  }

  public static clearHandlers() {
    this.handlersMap = {}
  }

  public static clearMarkedEntitys() {
    this.markedEntitys = []
  }

  private static dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name

    const isEventRegistered = eventClassName in this.handlersMap

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName]

      for (const handler of handlers) {
        handler(event)
      }
    }
  }
}
