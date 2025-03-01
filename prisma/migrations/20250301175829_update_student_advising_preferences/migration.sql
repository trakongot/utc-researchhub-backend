-- CreateEnum
CREATE TYPE "StudentAdvisingPreferencesStatusT" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropIndex
DROP INDEX "StudentAdvisingPreferences_student_id_faculty_member_id_fie_idx";

-- AlterTable
ALTER TABLE "LecturerPreferences" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "StudentAdvisingPreferences" ADD COLUMN     "status" "StudentAdvisingPreferencesStatusT" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "StudentAdvisingPreferences_faculty_member_id_idx" ON "StudentAdvisingPreferences"("faculty_member_id");

-- CreateIndex
CREATE INDEX "StudentAdvisingPreferences_student_id_idx" ON "StudentAdvisingPreferences"("student_id");

-- CreateIndex
CREATE INDEX "StudentAdvisingPreferences_faculty_member_id_createdAt_stat_idx" ON "StudentAdvisingPreferences"("faculty_member_id", "createdAt", "status");
