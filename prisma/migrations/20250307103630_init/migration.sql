-- CreateEnum
CREATE TYPE "UserT" AS ENUM ('STUDENT', 'ADMIN', 'DEAN', 'DEPARTMENT_HEAD', 'SECRETARY', 'LECTURER', 'ADVISOR');

-- CreateEnum
CREATE TYPE "TopicT" AS ENUM ('GRADUATED', 'RESEARCH', 'COMPETITION', 'COLLABORATION');

-- CreateEnum
CREATE TYPE "FileT" AS ENUM ('PDF', 'WORD', 'PRESENTATION', 'SPREADSHEET', 'AUTOCAD', 'IMAGE', 'VIDEO', 'CODE', 'DATASET', 'OTHER');

-- CreateEnum
CREATE TYPE "StudentStatusT" AS ENUM ('ACTIVE', 'INACTIVE', 'GRADUATED', 'DROPPED_OUT', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "GenderT" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "FacultyStatusT" AS ENUM ('ACTIVE', 'INACTIVE', 'RETIRED', 'RESIGNED', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "FacultyRoleT" AS ENUM ('ADMIN', 'DEAN', 'DEPARTMENT_HEAD', 'SECRETARY', 'LECTURER', 'ADVISOR');

-- CreateEnum
CREATE TYPE "DepartmentStatusT" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "FieldPoolStatusT" AS ENUM ('OPEN', 'CLOSED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "LecturerSelectionStatusT" AS ENUM ('REQUESTED_CHANGES', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "StudentSelectionStatusT" AS ENUM ('REQUESTED_CHANGES', 'PENDING', 'APPROVED', 'REJECTED', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "ProposedProjectStatusT" AS ENUM ('PENDING_ADVISOR', 'REQUESTED_CHANGES_ADVISOR', 'REJECTED_BY_ADVISOR', 'ADVISOR_APPROVED', 'REQUESTED_CHANGES_HEAD', 'REJECTED_BY_HEAD', 'APPROVED_BY_HEAD', 'CONFIRMED_BY_HEAD', 'CONFIRMED_BY_ADVISOR');

-- CreateEnum
CREATE TYPE "ProposalStatusT" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProjectMemberStatusT" AS ENUM ('PENDING', 'APPROVED', 'LOCKED');

-- CreateEnum
CREATE TYPE "ProjectStatusT" AS ENUM ('IN_PROGRESS', 'WAITING_FOR_EVALUATION', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MemberStatusT" AS ENUM ('PENDING', 'APPROVED', 'LOCKED');

-- CreateEnum
CREATE TYPE "ReportFileStatusT" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DefenseCommitteeStatusT" AS ENUM ('PREPARING', 'SCHEDULED', 'ONGOING', 'FINISHED');

-- CreateEnum
CREATE TYPE "DefenseCommitteeRoleT" AS ENUM ('CHAIRMAN', 'DEAN', 'SECRETARY', 'REVIEWER', 'MEMBER');

-- CreateEnum
CREATE TYPE "ProjectEvaluationStatusT" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "student_code" TEXT NOT NULL,
    "majo code" TEXT,
    "program_code" TEXT,
    "bio" TEXT,
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "phone" VARCHAR(20),
    "date_of_birth" TIMESTAMP(3),
    "gender" "GenderT",
    "admission_year" INTEGER,
    "graduation_year" INTEGER,
    "current_gpa" DOUBLE PRECISION,
    "credits_earned" INTEGER,
    "status" "StudentStatusT" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "profile_pic" TEXT,
    "last_login" TIMESTAMP(3),
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "department_id" TEXT,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty" (
    "id" TEXT NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "faculty_member_code" VARCHAR(50),
    "bio" TEXT,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "status" "FacultyStatusT" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "profile_picture" TEXT,
    "last_login" TIMESTAMP(3),
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "phone_number" TEXT,
    "rank" TEXT,
    "department_id" TEXT,

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty_role" (
    "id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "role" "FacultyRoleT" NOT NULL,

    CONSTRAINT "faculty_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" TEXT NOT NULL,
    "department_code" TEXT,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" "DepartmentStatusT" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "parent_department_id" TEXT,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_pool" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "FieldPoolStatusT" NOT NULL DEFAULT 'CLOSED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "registration_deadline" TIMESTAMP(3),
    "max_student_selection" INTEGER DEFAULT 3,
    "max_lecturer_selection" INTEGER DEFAULT 3,

    CONSTRAINT "field_pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_pool_department" (
    "field_pool_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "field_pool_department_pkey" PRIMARY KEY ("field_pool_id","department_id")
);

-- CreateTable
CREATE TABLE "field_pool_domain" (
    "field_pool_id" TEXT NOT NULL,
    "Domain_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "field_pool_domain_pkey" PRIMARY KEY ("field_pool_id","Domain_id")
);

-- CreateTable
CREATE TABLE "domain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecturer_selection" (
    "id" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "topic_title" TEXT NOT NULL,
    "description" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "current_capacity" INTEGER NOT NULL DEFAULT 0,
    "status" "LecturerSelectionStatusT" NOT NULL DEFAULT 'PENDING',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "lecturer_id" TEXT NOT NULL,
    "field_pool_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lecturer_selection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_selection" (
    "id" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "topicTitle" TEXT,
    "status" "StudentSelectionStatusT" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "student_id" TEXT NOT NULL,
    "faculty_member_id" TEXT,
    "field_pool_id" TEXT,
    "preferred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_by_id" TEXT,
    "approved_by_type" "UserT",

    CONSTRAINT "student_selection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_allocation" (
    "id" TEXT NOT NULL,
    "topicTitle" TEXT NOT NULL,
    "allocatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "student_id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "lecturer_id" TEXT NOT NULL,

    CONSTRAINT "project_allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposed_project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProposedProjectStatusT" NOT NULL DEFAULT 'PENDING_ADVISOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "proposal_deadline" TIMESTAMP(3),
    "topic_lock_date" TIMESTAMP(3),
    "approved_at" TIMESTAMP(3),
    "approved_by_id" TEXT,
    "proposal_outline_id" TEXT,
    "created_by_id" TEXT NOT NULL,
    "creator_type" "UserT" NOT NULL,

    CONSTRAINT "proposed_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposed_project_comment" (
    "id" TEXT NOT NULL,
    "commenter_id" TEXT,
    "role" "UserT" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "study_topic_darf_id" TEXT NOT NULL,

    CONSTRAINT "proposed_project_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_outline" (
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
    "created_by_id" TEXT NOT NULL,
    "creator_type" "UserT" NOT NULL,

    CONSTRAINT "proposal_outline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_member" (
    "id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "topic_type" "TopicT" NOT NULL,
    "member_id" TEXT NOT NULL,
    "role" "UserT" NOT NULL,
    "desc_role" TEXT,
    "status" "ProjectMemberStatusT" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
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

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "study_topic_id" TEXT NOT NULL,
    "commenter_id" TEXT NOT NULL,
    "role" "UserT" NOT NULL,

    CONSTRAINT "project_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_keyword" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "domain_id" TEXT NOT NULL,

    CONSTRAINT "project_keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_final_report" (
    "id" TEXT NOT NULL,
    "study_topic_id" TEXT NOT NULL,
    "main_report" TEXT NOT NULL,
    "file_size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "uploaded_by_id" TEXT,
    "uploaded_by_type" "UserT",

    CONSTRAINT "project_final_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_report_file" (
    "id" TEXT NOT NULL,
    "final_report_id" TEXT NOT NULL,
    "file_type" "FileT" NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "is_archived" BOOLEAN NOT NULL,
    "status" "ReportFileStatusT" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "uploaded_by_id" TEXT,

    CONSTRAINT "project_report_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_report_comment" (
    "id" TEXT NOT NULL,
    "final_report_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "UserT" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_report_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defense_committee" (
    "id" TEXT NOT NULL,
    "study_topic_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defense_date" TIMESTAMP(3) NOT NULL,
    "status" "DefenseCommitteeStatusT" NOT NULL DEFAULT 'SCHEDULED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "defense_committee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defense_committee_member" (
    "id" TEXT NOT NULL,
    "role" "DefenseCommitteeRoleT" NOT NULL,
    "defense_committee_id" TEXT NOT NULL,
    "faculty_member_id" TEXT NOT NULL,

    CONSTRAINT "defense_committee_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_evaluation" (
    "id" TEXT NOT NULL,
    "study_topic_id" TEXT NOT NULL,
    "final_score" DOUBLE PRECISION,
    "status" "ProjectEvaluationStatusT" NOT NULL,
    "evaluated_by_id" TEXT,
    "teacher_score" DOUBLE PRECISION,
    "committee_average_score" DOUBLE PRECISION,
    "teacher_weight" DOUBLE PRECISION DEFAULT 0.3,
    "committee_weight" DOUBLE PRECISION DEFAULT 0.7,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_criteria_score" (
    "id" TEXT NOT NULL,
    "study_topic_eval_id" TEXT NOT NULL,
    "criteria_id" TEXT NOT NULL,
    "evaluator_id" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "comment" TEXT,

    CONSTRAINT "project_criteria_score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_evaluation_score" (
    "id" TEXT NOT NULL,
    "role" "DefenseCommitteeRoleT",
    "score" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "evaluation_id" TEXT NOT NULL,
    "committee_member_id" TEXT NOT NULL,

    CONSTRAINT "project_evaluation_score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_criteria" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "evaluation_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
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

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_student_code_key" ON "student"("student_code");

-- CreateIndex
CREATE UNIQUE INDEX "student_email_key" ON "student"("email");

-- CreateIndex
CREATE INDEX "student_student_code_email_status_idx" ON "student"("student_code", "email", "status");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_faculty_member_code_key" ON "faculty"("faculty_member_code");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_email_key" ON "faculty"("email");

-- CreateIndex
CREATE INDEX "faculty_faculty_member_code_email_status_idx" ON "faculty"("faculty_member_code", "email", "status");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_role_faculty_id_role_key" ON "faculty_role"("faculty_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "field_pool_name_key" ON "field_pool"("name");

-- CreateIndex
CREATE UNIQUE INDEX "domain_name_key" ON "domain"("name");

-- CreateIndex
CREATE UNIQUE INDEX "lecturer_selection_lecturer_id_topic_title_key" ON "lecturer_selection"("lecturer_id", "topic_title");

-- CreateIndex
CREATE INDEX "student_selection_student_id_priority_idx" ON "student_selection"("student_id", "priority");

-- CreateIndex
CREATE INDEX "student_selection_faculty_member_id_created_at_status_idx" ON "student_selection"("faculty_member_id", "created_at", "status");

-- CreateIndex
CREATE UNIQUE INDEX "student_selection_student_id_faculty_member_id_priority_key" ON "student_selection"("student_id", "faculty_member_id", "priority");

-- CreateIndex
CREATE INDEX "project_allocation_student_id_lecturer_id_allocatedAt_idx" ON "project_allocation"("student_id", "lecturer_id", "allocatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "project_allocation_student_id_lecturer_id_topicTitle_key" ON "project_allocation"("student_id", "lecturer_id", "topicTitle");

-- CreateIndex
CREATE INDEX "project_member_topic_id_member_id_idx" ON "project_member"("topic_id", "member_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_member_topic_id_member_id_topic_type_key" ON "project_member"("topic_id", "member_id", "topic_type");

-- CreateIndex
CREATE INDEX "project_type_status_created_at_idx" ON "project"("type", "status", "created_at");

-- CreateIndex
CREATE INDEX "project_proposal_outline_id_idx" ON "project"("proposal_outline_id");

-- CreateIndex
CREATE INDEX "project_department_id_idx" ON "project"("department_id");

-- CreateIndex
CREATE INDEX "project_keyword_project_id_idx" ON "project_keyword"("project_id");

-- CreateIndex
CREATE INDEX "project_final_report_study_topic_id_idx" ON "project_final_report"("study_topic_id");

-- CreateIndex
CREATE INDEX "project_report_file_final_report_id_idx" ON "project_report_file"("final_report_id");

-- CreateIndex
CREATE INDEX "project_report_file_is_archived_idx" ON "project_report_file"("is_archived");

-- CreateIndex
CREATE INDEX "project_report_comment_final_report_id_idx" ON "project_report_comment"("final_report_id");

-- CreateIndex
CREATE UNIQUE INDEX "defense_committee_study_topic_id_key" ON "defense_committee"("study_topic_id");

-- CreateIndex
CREATE INDEX "defense_committee_defense_date_idx" ON "defense_committee"("defense_date");

-- CreateIndex
CREATE INDEX "defense_committee_study_topic_id_idx" ON "defense_committee"("study_topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "defense_committee_member_defense_committee_id_key" ON "defense_committee_member"("defense_committee_id");

-- CreateIndex
CREATE UNIQUE INDEX "defense_committee_member_faculty_member_id_key" ON "defense_committee_member"("faculty_member_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_evaluation_study_topic_id_key" ON "project_evaluation"("study_topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_evaluation_score_committee_member_id_key" ON "project_evaluation_score"("committee_member_id");

-- CreateIndex
CREATE INDEX "audit_log_entity_type_entity_id_created_at_idx" ON "audit_log"("entity_type", "entity_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_log_user_id_department_id_idx" ON "audit_log"("user_id", "department_id");

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_role" ADD CONSTRAINT "faculty_role_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_parent_department_id_fkey" FOREIGN KEY ("parent_department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_pool_department" ADD CONSTRAINT "field_pool_department_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_pool_department" ADD CONSTRAINT "field_pool_department_field_pool_id_fkey" FOREIGN KEY ("field_pool_id") REFERENCES "field_pool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_pool_domain" ADD CONSTRAINT "field_pool_domain_Domain_id_fkey" FOREIGN KEY ("Domain_id") REFERENCES "domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_pool_domain" ADD CONSTRAINT "field_pool_domain_field_pool_id_fkey" FOREIGN KEY ("field_pool_id") REFERENCES "field_pool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_selection" ADD CONSTRAINT "lecturer_selection_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_selection" ADD CONSTRAINT "lecturer_selection_field_pool_id_fkey" FOREIGN KEY ("field_pool_id") REFERENCES "field_pool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_selection" ADD CONSTRAINT "student_selection_faculty_member_id_fkey" FOREIGN KEY ("faculty_member_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_selection" ADD CONSTRAINT "student_selection_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_selection" ADD CONSTRAINT "student_selection_field_pool_id_fkey" FOREIGN KEY ("field_pool_id") REFERENCES "field_pool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_selection" ADD CONSTRAINT "student_selection_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_allocation" ADD CONSTRAINT "project_allocation_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_allocation" ADD CONSTRAINT "project_allocation_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_allocation" ADD CONSTRAINT "project_allocation_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project" ADD CONSTRAINT "fk_draft_topic_student" FOREIGN KEY ("created_by_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project" ADD CONSTRAINT "fk_draft_topic_faculty" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project" ADD CONSTRAINT "proposed_project_proposal_outline_id_fkey" FOREIGN KEY ("proposal_outline_id") REFERENCES "proposal_outline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project" ADD CONSTRAINT "proposed_project_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project_comment" ADD CONSTRAINT "proposed_project_comment_study_topic_darf_id_fkey" FOREIGN KEY ("study_topic_darf_id") REFERENCES "proposed_project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_outline" ADD CONSTRAINT "fk_proposal_student" FOREIGN KEY ("created_by_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_outline" ADD CONSTRAINT "fk_proposal_faculty" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_member" ADD CONSTRAINT "fk_topic_member_project" FOREIGN KEY ("topic_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_member" ADD CONSTRAINT "fk_topic_member_draft_topic" FOREIGN KEY ("topic_id") REFERENCES "proposed_project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_proposal_outline_id_fkey" FOREIGN KEY ("proposal_outline_id") REFERENCES "proposal_outline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_comment" ADD CONSTRAINT "project_comment_study_topic_id_fkey" FOREIGN KEY ("study_topic_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_comment" ADD CONSTRAINT "fk_project_comment_student" FOREIGN KEY ("commenter_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_comment" ADD CONSTRAINT "fk_project_comment_faculty" FOREIGN KEY ("commenter_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_keyword" ADD CONSTRAINT "project_keyword_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_keyword" ADD CONSTRAINT "project_keyword_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_final_report" ADD CONSTRAINT "project_final_report_study_topic_id_fkey" FOREIGN KEY ("study_topic_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_final_report" ADD CONSTRAINT "fk_project_final_report_student" FOREIGN KEY ("uploaded_by_id") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_final_report" ADD CONSTRAINT "fk_project_final_report_faculty" FOREIGN KEY ("uploaded_by_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_report_file" ADD CONSTRAINT "project_report_file_final_report_id_fkey" FOREIGN KEY ("final_report_id") REFERENCES "project_final_report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_report_file" ADD CONSTRAINT "fk_project_report_file_student" FOREIGN KEY ("uploaded_by_id") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_report_file" ADD CONSTRAINT "fk_project_report_file_faculty" FOREIGN KEY ("uploaded_by_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_report_comment" ADD CONSTRAINT "project_report_comment_final_report_id_fkey" FOREIGN KEY ("final_report_id") REFERENCES "project_final_report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_report_comment" ADD CONSTRAINT "fk_report_comment_student" FOREIGN KEY ("user_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_report_comment" ADD CONSTRAINT "fk_report_comment_faculty" FOREIGN KEY ("user_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_committee" ADD CONSTRAINT "defense_committee_study_topic_id_fkey" FOREIGN KEY ("study_topic_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_committee" ADD CONSTRAINT "defense_committee_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_committee_member" ADD CONSTRAINT "defense_committee_member_defense_committee_id_fkey" FOREIGN KEY ("defense_committee_id") REFERENCES "defense_committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_committee_member" ADD CONSTRAINT "defense_committee_member_faculty_member_id_fkey" FOREIGN KEY ("faculty_member_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_evaluation" ADD CONSTRAINT "project_evaluation_study_topic_id_fkey" FOREIGN KEY ("study_topic_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_evaluation" ADD CONSTRAINT "project_evaluation_evaluated_by_id_fkey" FOREIGN KEY ("evaluated_by_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_criteria_score" ADD CONSTRAINT "project_criteria_score_criteria_id_fkey" FOREIGN KEY ("criteria_id") REFERENCES "evaluation_criteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_criteria_score" ADD CONSTRAINT "project_criteria_score_study_topic_eval_id_fkey" FOREIGN KEY ("study_topic_eval_id") REFERENCES "project_evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_evaluation_score" ADD CONSTRAINT "project_evaluation_score_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "project_evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_evaluation_score" ADD CONSTRAINT "project_evaluation_score_committee_member_id_fkey" FOREIGN KEY ("committee_member_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_criteria" ADD CONSTRAINT "evaluation_criteria_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "fk_log_student" FOREIGN KEY ("user_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "fk_log_faculty" FOREIGN KEY ("user_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
