import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UpdateDraftTopicDto } from './dto';
import { DraftTopic } from './schemas';
import { IDraftTopicRepository } from './types';

@Injectable()
export class DraftTopicPrismaRepository implements IDraftTopicRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async get(id: string): Promise<DraftTopic | null> {
    const draft = await this.prisma.draftTopic.findUnique({
      where: { id },
      include: {
        members: true,
        DraftTopicComment: true,
      },
    });

    if (!draft) return null;

    return draft as DraftTopic;
  }

  async listByIds(ids: string[]): Promise<DraftTopic[]> {
    const drafts = await this.prisma.draftTopic.findMany({
      where: { id: { in: ids } },
    });

    return drafts as DraftTopic[];
  }

  async insert(dto: DraftTopic): Promise<void> {
    await this.prisma.draftTopic.create({
      data: {
        id: dto.id,
        title: dto.title,
        description: dto.description,
        field: dto.field,
        subField: dto.subField,
        status: dto.status,
        proposalOutlineId: dto.proposalOutlineId,
        proposalDeadline: dto.proposalDeadline,
        topicLockDate: dto.topicLockDate,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
        creatorId: dto.creatorId,
        creatorType: dto.creatorType,
      },
    });
  }

  async update(id: string, dto: UpdateDraftTopicDto): Promise<void> {
    await this.prisma.draftTopic.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        field: dto.field,
        subField: dto.subField,
        status: dto.status,
        proposalOutlineId: dto.proposalOutlineId,
        proposalDeadline: dto.proposalDeadline,
        topicLockDate: dto.topicLockDate,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.draftTopic.delete({
      where: { id },
    });
  }
}
