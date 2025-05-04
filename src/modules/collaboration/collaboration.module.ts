import { Module } from '@nestjs/common';
import { ProjectCommentModule } from './project-comment/project-comment.module';

import { ProposedProjectCommentModule } from './proposed-project-comment/proposed-project-comment.module';
import { ProposedProjectModule } from './proposed-project/proposed-project.module';

@Module({
  imports: [
    ProposedProjectModule,
    ProjectCommentModule,
    ProposedProjectCommentModule,
  ],
  exports: [
    ProposedProjectModule,
    ProjectCommentModule,
    ProposedProjectCommentModule,
  ],
})
export class CollaborationModule {}
