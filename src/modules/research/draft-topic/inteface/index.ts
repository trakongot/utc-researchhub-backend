import { CreateDraftTopicDto } from '../dto/create-study-topic.dto';
import { DraftTopic } from '../schemas';

export interface IDraftTopicService {
  create(dto: CreateDraftTopicDto): Promise<string>;
  // update(
  //   id: string,
  //   dto: DraftTopicUpdateDTO,
  //   requester: Requester,
  // ): Promise<boolean>;
  // delete(id: string, requester: Requester): Promise<boolean>;
}

export interface IDraftTopicRepository
  extends IDraftTopicQueryRepository,
    IDraftTopicCommandRepository {}

export interface IDraftTopicQueryRepository {
  get(id: string): Promise<DraftTopic | null>;
  // listByIds(ids: string[]): Promise<DraftTopic[]>;
}

export interface IDraftTopicCommandRepository {
  insert(dto: DraftTopic): Promise<void>;
  // update(id: string, dto: UpdateDraftTopicDto): Promise<void>;
  // delete(id: string): Promise<void>;
}
