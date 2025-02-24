import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { ReqWithRequester } from 'src/share';
import { DraftTopicPrismaRepository } from './draft-topic-prisma.repository';
import { DraftTopicService } from './draft-topic.service';
import { CreateDraftTopicDto } from './dto/create-study-topic.dto';

@Controller('study-topic-draft')
export class DraftTopicController {
  constructor(
    private readonly service: DraftTopicService,
    private readonly repository: DraftTopicPrismaRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async() {
    return { hi: 'hello' };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStudyTopicDarftByStudent(
    @Request() req: ReqWithRequester,
    @Body() dto: CreateDraftTopicDto,
  ) {
    const { requester } = req;

    return 2;
  }
}
