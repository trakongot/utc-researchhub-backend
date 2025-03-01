-- CreateEnum
CREATE TYPE "UserT" AS ENUM ('STUDENT', 'ADMIN', 'DEAN', 'DEPARTMENT_HEAD', 'SECRETARY', 'LECTURER', 'ADVISOR');

-- CreateEnum
CREATE TYPE "TopicT" AS ENUM ('GRADUATED', 'RESEARCH', 'COMPETITION', 'COLLABORATION');

-- CreateEnum
CREATE TYPE "FileT" AS ENUM ('PDF', 'WORD', 'PRESENTATION', 'SPREADSHEET', 'AUTOCAD', 'IMAGE', 'VIDEO', 'CODE', 'DATASET', 'OTHER');

-- CreateEnum
CREATE TYPE "StudentStatusT" AS ENUM ('ACTIVE', 'INACTIVE', 'GRADUATED', 'DROPPED_OUT', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "FacultyStatusT" AS ENUM ('ACTIVE', 'INACTIVE', 'RETIRED', 'RESIGNED', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "FacultyRoleT" AS ENUM ('ADMIN', 'DEAN', 'DEPARTMENT_HEAD', 'SECRETARY', 'LECTURER', 'ADVISOR');

-- CreateEnum
CREATE TYPE "DepartmentStatusT" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "DraftTopicsStatusT" AS ENUM ('PENDING_ADVISOR', 'REQUESTED_CHANGES_ADVISOR', 'REJECTED_BY_ADVISOR', 'ADVISOR_APPROVED', 'REQUESTED_CHANGES_HEAD', 'REJECTED_BY_HEAD', 'APPROVED_BY_HEAD');

-- CreateEnum
CREATE TYPE "ProposalStatusT" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TopicMemberStatusT" AS ENUM ('PENDING', 'APPROVED', 'LOCKED');

-- CreateEnum
CREATE TYPE "ProjectStatusT" AS ENUM ('IN_PROGRESS', 'WAITING_FOR_EVALUATION', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MemberStatusT" AS ENUM ('PENDING', 'APPROVED', 'LOCKED');

-- CreateEnum
CREATE TYPE "ResultFileStatusT" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DefenseCommitteeStatusT" AS ENUM ('PREPARING', 'SCHEDULED', 'ONGOING', 'FINISHED');

-- CreateEnum
CREATE TYPE "DefenseCommitteeRoleT" AS ENUM ('CHAIRMAN', 'DEAN', 'SECRETARY', 'REVIEWER', 'MEMBER');

-- CreateEnum
CREATE TYPE "EvaluationStatusT" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "Students" (
    "id" TEXT NOT NULL,
    "student_code" TEXT NOT NULL,
    "bio" TEXT,
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "status" "StudentStatusT" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "profile_pic" TEXT,
    "last_login" TIMESTAMP(3),
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "department_id" TEXT,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacultyMembers" (
    "id" TEXT NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "faculty_member_code" VARCHAR(50),
    "bio" TEXT,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "status" "FacultyStatusT" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "profile_picture" TEXT,
    "last_login" TIMESTAMP(3),
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "department_id" TEXT,

    CONSTRAINT "FacultyMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacultyRoles" (
    "id" TEXT NOT NULL,
    "faculty_member_id" TEXT NOT NULL,
    "role" "FacultyRoleT" NOT NULL,

    CONSTRAINT "FacultyRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemLog" (
    "id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "action" TEXT NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "department_id" TEXT,
    "user_id" TEXT NOT NULL,
    "user_type" "UserT" NOT NULL,

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VersionHistory" (
    "id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" TEXT NOT NULL,
    "user_type" "UserT" NOT NULL,

    CONSTRAINT "VersionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicDepartments" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" "DepartmentStatusT" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "parent_department_id" TEXT,

    CONSTRAINT "AcademicDepartments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LecturerPreferences" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "topicTitle" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lecturer_id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,

    CONSTRAINT "LecturerPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAdvisingPreferences" (
    "id" TEXT NOT NULL,
    "preferredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "student_id" TEXT NOT NULL,
    "faculty_member_id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,

    CONSTRAINT "StudentAdvisingPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GraduationProjectAllocations" (
    "id" TEXT NOT NULL,
    "topicTitle" TEXT NOT NULL,
    "allocatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "student_id" TEXT NOT NULL,
    "lecturer_id" TEXT NOT NULL,

    CONSTRAINT "GraduationProjectAllocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DraftTopics" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "DraftTopicsStatusT" NOT NULL DEFAULT 'PENDING_ADVISOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "proposal_deadline" TIMESTAMP(3),
    "topic_lock_date" TIMESTAMP(3),
    "approved_at" TIMESTAMP(3),
    "proposal_outline_id" TEXT,
    "creator_id" TEXT NOT NULL,
    "creator_type" "UserT" NOT NULL,
    "approved_by_id" TEXT,
    "studentsId" TEXT,
    "fieldsId" TEXT,

    CONSTRAINT "DraftTopics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DraftTopicsComment" (
    "id" TEXT NOT NULL,
    "study_topic_darf_id" TEXT NOT NULL,
    "commenter_id" TEXT,
    "role" "UserT" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DraftTopicsComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalOutline" (
    "id" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "methodology" TEXT NOT NULL,
    "expected_results" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "status" "ProposalStatusT" NOT NULL DEFAULT 'PENDING_REVIEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "creator_id" TEXT NOT NULL,
    "creator_type" "UserT" NOT NULL,

    CONSTRAINT "ProposalOutline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicMember" (
    "id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "topic_type" "TopicT" NOT NULL,
    "member_id" TEXT NOT NULL,
    "type_member" "UserT" NOT NULL,
    "desc_role" TEXT,
    "status" "TopicMemberStatusT" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopicMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "type" "TopicT" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "field" TEXT NOT NULL,
    "status" "ProjectStatusT" NOT NULL DEFAULT 'IN_PROGRESS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "proposal_deadline" TIMESTAMP(3),
    "topic_lock_date" TIMESTAMP(3),
    "custom_fields" JSONB,
    "proposal_outline_id" TEXT,
    "approved_by_id" TEXT NOT NULL,
    "approved_by_type" "UserT" NOT NULL,
    "department_id" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "study_topic_id" TEXT NOT NULL,
    "commenter_id" TEXT NOT NULL,
    "role" "UserT" NOT NULL,

    CONSTRAINT "ProjectComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectKeywords" (
    "id" TEXT NOT NULL,
    "study_topic_id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,

    CONSTRAINT "ProjectKeywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectResultOutline" (
    "id" TEXT NOT NULL,
    "study_topic_id" TEXT NOT NULL,
    "main_report" TEXT NOT NULL,
    "file_size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "department_id" TEXT,
    "uploaded_by_id" TEXT,
    "uploaded_by_type" "UserT",

    CONSTRAINT "ProjectResultOutline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectResultFile" (
    "id" TEXT NOT NULL,
    "result_outline_id" TEXT NOT NULL,
    "file_type" "FileT" NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "is_archived" BOOLEAN NOT NULL,
    "status" "ResultFileStatusT" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "uploaded_by_id" TEXT,

    CONSTRAINT "ProjectResultFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectResultComment" (
    "id" TEXT NOT NULL,
    "result_outline_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "UserT" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectResultComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefenseCommittee" (
    "id" TEXT NOT NULL,
    "study_topic_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defense_date" TIMESTAMP(3) NOT NULL,
    "status" "DefenseCommitteeStatusT" NOT NULL DEFAULT 'SCHEDULED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "DefenseCommittee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefenseMember" (
    "id" TEXT NOT NULL,
    "role" "DefenseCommitteeRoleT" NOT NULL,
    "defense_committee_id" TEXT NOT NULL,
    "faculty_member_id" TEXT NOT NULL,

    CONSTRAINT "DefenseMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectEvaluation" (
    "id" TEXT NOT NULL,
    "study_topic_id" TEXT NOT NULL,
    "final_score" DOUBLE PRECISION,
    "status" "EvaluationStatusT" NOT NULL,
    "evaluated_by_id" TEXT,
    "teacher_score" DOUBLE PRECISION,
    "committee_average_score" DOUBLE PRECISION,
    "teacher_weight" DOUBLE PRECISION DEFAULT 0.3,
    "committee_weight" DOUBLE PRECISION DEFAULT 0.7,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectCriteriaScore" (
    "id" TEXT NOT NULL,
    "study_topic_eval_id" TEXT NOT NULL,
    "criteria_id" TEXT NOT NULL,
    "evaluator_id" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "comment" TEXT,

    CONSTRAINT "ProjectCriteriaScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectEvaluationScore" (
    "id" TEXT NOT NULL,
    "role" "DefenseCommitteeRoleT",
    "score" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "evaluation_id" TEXT NOT NULL,
    "committee_member_id" TEXT NOT NULL,

    CONSTRAINT "ProjectEvaluationScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationCriteria" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "EvaluationCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemFiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "file_type" "FileT" NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "uploaded_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemFiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Students_student_code_key" ON "Students"("student_code");

-- CreateIndex
CREATE UNIQUE INDEX "Students_email_key" ON "Students"("email");

-- CreateIndex
CREATE INDEX "Students_student_code_email_status_idx" ON "Students"("student_code", "email", "status");

-- CreateIndex
CREATE UNIQUE INDEX "FacultyMembers_faculty_member_code_key" ON "FacultyMembers"("faculty_member_code");

-- CreateIndex
CREATE UNIQUE INDEX "FacultyMembers_email_key" ON "FacultyMembers"("email");

-- CreateIndex
CREATE INDEX "FacultyMembers_faculty_member_code_email_status_idx" ON "FacultyMembers"("faculty_member_code", "email", "status");

-- CreateIndex
CREATE UNIQUE INDEX "FacultyRoles_faculty_member_id_role_key" ON "FacultyRoles"("faculty_member_id", "role");

-- CreateIndex
CREATE INDEX "SystemLog_entity_type_entity_id_created_at_idx" ON "SystemLog"("entity_type", "entity_id", "created_at");

-- CreateIndex
CREATE INDEX "SystemLog_user_id_department_id_idx" ON "SystemLog"("user_id", "department_id");

-- CreateIndex
CREATE INDEX "VersionHistory_entity_type_entity_id_version_idx" ON "VersionHistory"("entity_type", "entity_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicDepartments_code_key" ON "AcademicDepartments"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicDepartments_name_key" ON "AcademicDepartments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Field_name_key" ON "Field"("name");

-- CreateIndex
CREATE INDEX "LecturerPreferences_lecturer_id_field_id_idx" ON "LecturerPreferences"("lecturer_id", "field_id");

-- CreateIndex
CREATE UNIQUE INDEX "LecturerPreferences_lecturer_id_topicTitle_key" ON "LecturerPreferences"("lecturer_id", "topicTitle");

-- CreateIndex
CREATE INDEX "StudentAdvisingPreferences_student_id_faculty_member_id_fie_idx" ON "StudentAdvisingPreferences"("student_id", "faculty_member_id", "field_id");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAdvisingPreferences_student_id_faculty_member_id_fie_key" ON "StudentAdvisingPreferences"("student_id", "faculty_member_id", "field_id");

-- CreateIndex
CREATE INDEX "GraduationProjectAllocations_student_id_lecturer_id_allocat_idx" ON "GraduationProjectAllocations"("student_id", "lecturer_id", "allocatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "GraduationProjectAllocations_student_id_lecturer_id_topicTi_key" ON "GraduationProjectAllocations"("student_id", "lecturer_id", "topicTitle");

-- CreateIndex
CREATE INDEX "TopicMember_topic_id_member_id_idx" ON "TopicMember"("topic_id", "member_id");

-- CreateIndex
CREATE UNIQUE INDEX "TopicMember_topic_id_member_id_topic_type_key" ON "TopicMember"("topic_id", "member_id", "topic_type");

-- CreateIndex
CREATE INDEX "Project_type_status_created_at_idx" ON "Project"("type", "status", "created_at");

-- CreateIndex
CREATE INDEX "Project_proposal_outline_id_idx" ON "Project"("proposal_outline_id");

-- CreateIndex
CREATE INDEX "Project_department_id_idx" ON "Project"("department_id");

-- CreateIndex
CREATE INDEX "ProjectKeywords_study_topic_id_idx" ON "ProjectKeywords"("study_topic_id");

-- CreateIndex
CREATE INDEX "ProjectResultOutline_study_topic_id_idx" ON "ProjectResultOutline"("study_topic_id");

-- CreateIndex
CREATE INDEX "ProjectResultFile_result_outline_id_idx" ON "ProjectResultFile"("result_outline_id");

-- CreateIndex
CREATE INDEX "ProjectResultFile_is_archived_idx" ON "ProjectResultFile"("is_archived");

-- CreateIndex
CREATE INDEX "ProjectResultComment_result_outline_id_idx" ON "ProjectResultComment"("result_outline_id");

-- CreateIndex
CREATE UNIQUE INDEX "DefenseCommittee_study_topic_id_key" ON "DefenseCommittee"("study_topic_id");

-- CreateIndex
CREATE INDEX "DefenseCommittee_defense_date_idx" ON "DefenseCommittee"("defense_date");

-- CreateIndex
CREATE INDEX "DefenseCommittee_study_topic_id_idx" ON "DefenseCommittee"("study_topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "DefenseMember_defense_committee_id_key" ON "DefenseMember"("defense_committee_id");

-- CreateIndex
CREATE UNIQUE INDEX "DefenseMember_faculty_member_id_key" ON "DefenseMember"("faculty_member_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectEvaluation_study_topic_id_key" ON "ProjectEvaluation"("study_topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectEvaluationScore_committee_member_id_key" ON "ProjectEvaluationScore"("committee_member_id");

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "AcademicDepartments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultyMembers" ADD CONSTRAINT "FacultyMembers_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "AcademicDepartments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultyRoles" ADD CONSTRAINT "FacultyRoles_faculty_member_id_fkey" FOREIGN KEY ("faculty_member_id") REFERENCES "FacultyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemLog" ADD CONSTRAINT "SystemLog_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "AcademicDepartments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemLog" ADD CONSTRAINT "fk_log_student" FOREIGN KEY ("user_id") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemLog" ADD CONSTRAINT "fk_log_faculty" FOREIGN KEY ("user_id") REFERENCES "FacultyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicDepartments" ADD CONSTRAINT "AcademicDepartments_parent_department_id_fkey" FOREIGN KEY ("parent_department_id") REFERENCES "AcademicDepartments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Field"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LecturerPreferences" ADD CONSTRAINT "LecturerPreferences_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "FacultyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LecturerPreferences" ADD CONSTRAINT "LecturerPreferences_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAdvisingPreferences" ADD CONSTRAINT "StudentAdvisingPreferences_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAdvisingPreferences" ADD CONSTRAINT "StudentAdvisingPreferences_faculty_member_id_fkey" FOREIGN KEY ("faculty_member_id") REFERENCES "FacultyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAdvisingPreferences" ADD CONSTRAINT "StudentAdvisingPreferences_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraduationProjectAllocations" ADD CONSTRAINT "GraduationProjectAllocations_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraduationProjectAllocations" ADD CONSTRAINT "GraduationProjectAllocations_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "FacultyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftTopics" ADD CONSTRAINT "DraftTopics_proposal_outline_id_fkey" FOREIGN KEY ("proposal_outline_id") REFERENCES "ProposalOutline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftTopics" ADD CONSTRAINT "fk_draft_topic_student" FOREIGN KEY ("creator_id") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftTopics" ADD CONSTRAINT "fk_draft_topic_faculty" FOREIGN KEY ("creator_id") REFERENCES "FacultyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftTopics" ADD CONSTRAINT "DraftTopics_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "FacultyMembers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftTopics" ADD CONSTRAINT "DraftTopics_fieldsId_fkey" FOREIGN KEY ("fieldsId") REFERENCES "Field"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftTopicsComment" ADD CONSTRAINT "DraftTopicsComment_study_topic_darf_id_fkey" FOREIGN KEY ("study_topic_darf_id") REFERENCES "DraftTopics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalOutline" ADD CONSTRAINT "fk_proposal_student" FOREIGN KEY ("creator_id") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalOutline" ADD CONSTRAINT "fk_proposal_faculty" FOREIGN KEY ("creator_id") REFERENCES "FacultyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicMember" ADD CONSTRAINT "fk_topic_member_project" FOREIGN KEY ("topic_id") REFERENCES "Project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TopicMember" ADD CONSTRAINT "fk_topic_member_draft_topic" FOREIGN KEY ("topic_id") REFERENCES "DraftTopics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_proposal_outline_id_fkey" FOREIGN KEY ("proposal_outline_id") REFERENCES "ProposalOutline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "FacultyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "AcademicDepartments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectComment" ADD CONSTRAINT "ProjectComment_study_topic_id_fkey" FOREIGN KEY ("study_topic_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectComment" ADD CONSTRAINT "fk_project_comment_student" FOREIGN KEY ("commenter_id") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectComment" ADD CONSTRAINT "fk_project_comment_faculty" FOREIGN KEY ("commenter_id") REFERENCES "FacultyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectKeywords" ADD CONSTRAINT "ProjectKeywords_study_topic_id_fkey" FOREIGN KEY ("study_topic_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResultOutline" ADD CONSTRAINT "ProjectResultOutline_study_topic_id_fkey" FOREIGN KEY ("study_topic_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResultOutline" ADD CONSTRAINT "ProjectResultOutline_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "AcademicDepartments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResultOutline" ADD CONSTRAINT "fk_project_result_outline_student" FOREIGN KEY ("uploaded_by_id") REFERENCES "Students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResultOutline" ADD CONSTRAINT "fk_project_result_outline_faculty" FOREIGN KEY ("uploaded_by_id") REFERENCES "FacultyMembers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResultFile" ADD CONSTRAINT "ProjectResultFile_result_outline_id_fkey" FOREIGN KEY ("result_outline_id") REFERENCES "ProjectResultOutline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResultFile" ADD CONSTRAINT "fk_project_result_outline_student" FOREIGN KEY ("uploaded_by_id") REFERENCES "Students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResultFile" ADD CONSTRAINT "fk_project_result_outline_faculty" FOREIGN KEY ("uploaded_by_id") REFERENCES "FacultyMembers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResultComment" ADD CONSTRAINT "ProjectResultComment_result_outline_id_fkey" FOREIGN KEY ("result_outline_id") REFERENCES "ProjectResultOutline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResultComment" ADD CONSTRAINT "fk_result_comment_student" FOREIGN KEY ("user_id") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResultComment" ADD CONSTRAINT "fk_result_comment_faculty" FOREIGN KEY ("user_id") REFERENCES "FacultyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefenseCommittee" ADD CONSTRAINT "DefenseCommittee_study_topic_id_fkey" FOREIGN KEY ("study_topic_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefenseCommittee" ADD CONSTRAINT "DefenseCommittee_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "FacultyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefenseMember" ADD CONSTRAINT "DefenseMember_defense_committee_id_fkey" FOREIGN KEY ("defense_committee_id") REFERENCES "DefenseCommittee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefenseMember" ADD CONSTRAINT "DefenseMember_faculty_member_id_fkey" FOREIGN KEY ("faculty_member_id") REFERENCES "FacultyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEvaluation" ADD CONSTRAINT "ProjectEvaluation_study_topic_id_fkey" FOREIGN KEY ("study_topic_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEvaluation" ADD CONSTRAINT "ProjectEvaluation_evaluated_by_id_fkey" FOREIGN KEY ("evaluated_by_id") REFERENCES "FacultyMembers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectCriteriaScore" ADD CONSTRAINT "ProjectCriteriaScore_study_topic_eval_id_fkey" FOREIGN KEY ("study_topic_eval_id") REFERENCES "ProjectEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectCriteriaScore" ADD CONSTRAINT "ProjectCriteriaScore_criteria_id_fkey" FOREIGN KEY ("criteria_id") REFERENCES "EvaluationCriteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEvaluationScore" ADD CONSTRAINT "ProjectEvaluationScore_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "ProjectEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEvaluationScore" ADD CONSTRAINT "ProjectEvaluationScore_committee_member_id_fkey" FOREIGN KEY ("committee_member_id") REFERENCES "FacultyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationCriteria" ADD CONSTRAINT "EvaluationCriteria_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "FacultyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemFiles" ADD CONSTRAINT "SystemFiles_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "FacultyMembers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
