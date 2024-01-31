import { Injectable } from '@nestjs/common'

import { CategoryRepository } from '@/domain/finance/application/repositories/category-repository'
import { Category } from '@/domain/finance/enterprise/entities/category'

import { PrismaCategoryMapper } from '../mappers/prisma-category-mapper'
import { PrismaClientManager, PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(
    private prisma: PrismaService,
    private clientManager: PrismaClientManager,
  ) {}

  private getPrisma(tKey?: string) {
    return tKey ? this.clientManager.getClient(tKey) : this.prisma
  }

  async create(category: Category, t?: string): Promise<void> {
    const prisma = this.getPrisma(t)
    await prisma.category.create({
      data: PrismaCategoryMapper.toPrisma(category),
    })
  }

  async save(category: Category, t?: string): Promise<void> {
    const prisma = this.getPrisma(t)
    await prisma.category.update({
      data: PrismaCategoryMapper.toPrisma(category),
      where: {
        id: category.id.toValue(),
      },
    })
  }

  async delete(category: Category, t?: string): Promise<void> {
    const prisma = this.getPrisma(t)
    await prisma.category.delete({
      where: {
        id: category.id.toValue(),
      },
    })
  }

  async findById(id: string, t?: string): Promise<Category> {
    const prisma = this.getPrisma(t)
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    })
    if (!category) {
      return null
    }
    return PrismaCategoryMapper.toDomain(category)
  }

  async findByName(name: string, t?: string): Promise<Category> {
    const prisma = this.getPrisma(t)
    const category = await prisma.category.findFirst({
      where: {
        name,
      },
    })
    if (!category) {
      return null
    }
    return PrismaCategoryMapper.toDomain(category)
  }
}
