import { Injectable } from '@nestjs/common'

import { CategoryRepository } from '@/domain/finance/application/repositories/category-repository'
import { Category } from '@/domain/finance/enterprise/entities/category'

import { PrismaCategoryMapper } from '../mappers/prisma-category-mapper'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(category: Category): Promise<void> {
    await this.prisma.category.create({
      data: PrismaCategoryMapper.toPrisma(category),
    })
  }

  async save(category: Category): Promise<void> {
    await this.prisma.category.update({
      data: PrismaCategoryMapper.toPrisma(category),
      where: {
        id: category.id.toValue(),
      },
    })
  }

  async delete(category: Category): Promise<void> {
    await this.prisma.category.delete({
      where: {
        id: category.id.toValue(),
      },
    })
  }

  async findById(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    })
    if (!category) {
      return null
    }
    return PrismaCategoryMapper.toDomain(category)
  }

  async findByName(name: string): Promise<Category> {
    const category = await this.prisma.category.findFirst({
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
