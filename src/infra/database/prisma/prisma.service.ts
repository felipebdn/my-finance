import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { ClsService } from 'nestjs-cls'

import { TransactionScope } from '@/domain/finance/application/transaction/transaction-scope'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, TransactionScope
{
  constructor(private transactionContext: ClsService) {
    super({
      log: ['warn', 'error'],
    })
  }

  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }

  async run(fn: () => Promise<void>, transactionKey: string): Promise<void> {
    // tente obter o Transaction Client
    const prisma = this.transactionContext.get(
      `PRISMA_CLIENT__KEY_${transactionKey}`,
    ) as Prisma.TransactionClient

    // se o Cliente de Transação
    if (prisma) {
      // existe, não há necessidade de criar uma transação e você apenas executa o retorno de chamada
      await fn()
    } else {
      // se não existe, cria o prisma transaction
      await this.$transaction(async (prisma) => {
        // e salve o Transaction Client dentro do namespace CLS para ser recuperado posteriormente
        this.transactionContext.set(
          `PRISMA_CLIENT__KEY_${transactionKey}`,
          prisma,
        )

        try {
          // execute o retorno de chamada da transação
          await fn()
        } catch (error) {
          // desconfigurar o cliente de transação quando algo der errado
          this.transactionContext.set(
            `PRISMA_CLIENT__KEY_${transactionKey}`,
            null,
          )
          throw error
        }
      })
    }
  }
}

@Injectable()
export class PrismaClientManager {
  constructor(
    private prisma: PrismaClient,
    private transactionContext: ClsService,
  ) {}

  getClient(transactionKey?: string): Prisma.TransactionClient {
    const prisma = this.transactionContext.get(
      `PRISMA_CLIENT_KEY_${transactionKey}`,
    ) as Prisma.TransactionClient
    if (prisma) {
      return prisma
    } else {
      return this.prisma
    }
  }
}
