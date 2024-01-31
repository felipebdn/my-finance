import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'

export function makeNotification(
  override?: Partial<NotificationProps>,
  id?: UniqueEntityId,
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(3),
      ...override,
    },
    id,
  )
  return notification
}

// export class NotificationFactory {
//   constructor(private prisma: PrismaService) {}
//   async makePrismaNotification(data: Partial<NotificationProps>) {
//     const notification = makeNotification(data)
//     await this.prisma.notification.create({
//       data: PrismaNotificationMapper.toPrisma(notification),
//     })
//     return notification
//   }
// }
