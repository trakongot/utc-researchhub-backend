import { Injectable } from '@nestjs/common';
// import { v7 } from 'uuid';
import { CreateDraftTopicDto } from './dto/create-study-topic.dto';
import { IDraftTopicService } from './inteface';

@Injectable()
export class DraftTopicService implements IDraftTopicService {
  constructor() {}

  async create(dto: CreateDraftTopicDto): Promise<string> {
    return 'hi';
  }
  // update(
  //   id: string,
  //   dto: DraftTopicUpdateDTO,
  //   requester: Requester,
  // ): Promise<boolean> {
  //   throw new Error('Method not implemented.');
  // }
  // delete(id: string, requester: Requester): Promise<boolean> {
  //   throw new Error('Method not implemented.');
  // }
}
