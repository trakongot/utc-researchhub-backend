/*
  Warnings:

  - The `status` column on the `AcademicDepartments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `DefenseCommittee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `ProjectResultFile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `TopicMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `ProjectEvaluation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DepartmentStatusT" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TopicMemberStatusT" AS ENUM ('PENDING', 'APPROVED', 'LOCKED');

-- CreateEnum
CREATE TYPE "ResultFileStatusT" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DefenseCommitteeStatusT" AS ENUM ('PREPARING', 'SCHEDULED', 'ONGOING', 'FINISHED');

-- CreateEnum
CREATE TYPE "EvaluationStatusT" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "AcademicDepartments" DROP COLUMN "status",
ADD COLUMN     "status" "DepartmentStatusT" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "DefenseCommittee" DROP COLUMN "status",
ADD COLUMN     "status" "DefenseCommitteeStatusT" NOT NULL DEFAULT 'SCHEDULED';

-- AlterTable
ALTER TABLE "ProjectEvaluation" DROP COLUMN "status",
ADD COLUMN     "status" "EvaluationStatusT" NOT NULL;

-- AlterTable
ALTER TABLE "ProjectResultFile" DROP COLUMN "status",
ADD COLUMN     "status" "ResultFileStatusT" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "TopicMember" DROP COLUMN "status",
ADD COLUMN     "status" "TopicMemberStatusT" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "DefenseCommitteeStatus";

-- DropEnum
DROP TYPE "DepartmentStatus";

-- DropEnum
DROP TYPE "EvaluationStatusType";

-- DropEnum
DROP TYPE "ResultFileStatus";

-- DropEnum
DROP TYPE "TopicMemberStatus";
