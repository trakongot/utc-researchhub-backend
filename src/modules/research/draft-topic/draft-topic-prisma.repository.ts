import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DraftTopic } from './schemas';
import { IDraftTopicRepository } from './types';
import { UpdateDraftTopicDto } from './dto';

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

    return {
      id: draft.id,
      title: draft.title,
      description: draft.description || undefined,
      field: draft.field,
      subField: draft.subField || undefined,
      status: draft.status,
      proposalOutlineId: draft.proposalOutlineId || undefined,
      proposalDeadline: draft.proposalDeadline || undefined,
      topicLockDate: draft.topicLockDate || undefined,
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt,
      creatorId: draft.creatorId,
      creatorType: draft.creatorType,
    };
  }

  async listByIds(ids: string[]): Promise<DraftTopic[]> {
    const drafts = await this.prisma.draftTopic.findMany({
      where: { id: { in: ids } },
      include: {
        members: true,
        DraftTopicComment: true,
      },
    });

    return drafts.map((draft) => ({
      id: draft.id,
      title: draft.title,
      description: draft.description || undefined,
      field: draft.field,
      subField: draft.subField || undefined,
      status: draft.status,
      proposalOutlineId: draft.proposalOutlineId || undefined,
      proposalDeadline: draft.proposalDeadline || undefined,
      topicLockDate: draft.topicLockDate || undefined,
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt,
      creatorId: draft.creatorId,
      creatorType: draft.creatorType,
      studentsId: draft.studentsId || undefined,
      members: draft.members || undefined,
      comments: draft.DraftTopicComment || undefined,
    }));
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
