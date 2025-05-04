/*
  Warnings:

  - The values [PENDING_ADVISOR,REQUESTED_CHANGES_ADVISOR,REJECTED_BY_ADVISOR,ADVISOR_APPROVED] on the enum `ProposedProjectStatusT` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProposedProjectStatusT_new" AS ENUM ('TOPIC_SUBMISSION_PENDING', 'TOPIC_PENDING_ADVISOR', 'TOPIC_REQUESTED_CHANGES', 'TOPIC_APPROVED', 'OUTLINE_PENDING_SUBMISSION', 'OUTLINE_PENDING_ADVISOR', 'OUTLINE_REQUESTED_CHANGES', 'OUTLINE_REJECTED', 'OUTLINE_APPROVED', 'PENDING_HEAD', 'REQUESTED_CHANGES_HEAD', 'REJECTED_BY_HEAD', 'APPROVED_BY_HEAD');
ALTER TABLE "proposed_project" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "proposed_project" ALTER COLUMN "status" TYPE "ProposedProjectStatusT_new" USING ("status"::text::"ProposedProjectStatusT_new");
ALTER TYPE "ProposedProjectStatusT" RENAME TO "ProposedProjectStatusT_old";
ALTER TYPE "ProposedProjectStatusT_new" RENAME TO "ProposedProjectStatusT";
DROP TYPE "ProposedProjectStatusT_old";
ALTER TABLE "proposed_project" ALTER COLUMN "status" SET DEFAULT 'TOPIC_SUBMISSION_PENDING';
COMMIT;
