-- CreateEnum
CREATE TYPE "UserT" AS ENUM ('STUDENT', 'FACULTY');

-- CreateEnum
CREATE TYPE "ProjectT" AS ENUM ('GRADUATED', 'RESEARCH', 'COMPETITION', 'COLLABORATION');

-- CreateEnum
CREATE TYPE "StudentStatusT" AS ENUM ('ACTIVE', 'INACTIVE', 'GRADUATED', 'DROPPED_OUT', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "GenderT" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "FacultyStatusT" AS ENUM ('ACTIVE', 'INACTIVE', 'RETIRED', 'RESIGNED', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "FacultyRoleT" AS ENUM ('ADMIN', 'DEAN', 'DEPARTMENT_HEAD', 'SECRETARY', 'LECTURER', 'ADVISOR', 'REVIEWER');

-- CreateEnum
CREATE TYPE "DepartmentStatusT" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "FieldPoolStatusT" AS ENUM ('OPEN', 'CLOSED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "LecturerSelectionStatusT" AS ENUM ('REQUESTED_CHANGES', 'PENDING', 'APPROVED', 'REJECTED', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "StudentSelectionStatusT" AS ENUM ('REQUESTED_CHANGES', 'PENDING', 'APPROVED', 'REJECTED', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "ProposedProjectStatusT" AS ENUM ('TOPIC_SUBMISSION_PENDING', 'PENDING_ADVISOR', 'REQUESTED_CHANGES_ADVISOR', 'REJECTED_BY_ADVISOR', 'ADVISOR_APPROVED', 'PENDING_HEAD', 'REQUESTED_CHANGES_HEAD', 'REJECTED_BY_HEAD', 'APPROVED_BY_HEAD');

-- CreateEnum
CREATE TYPE "ProposedProjectMemberStatusT" AS ENUM ('ACTIVE', 'REMOVED');

-- CreateEnum
CREATE TYPE "ProposalStatusT" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'REQUESTED_CHANGES', 'APPROVED', 'REJECTED', 'LOCKED');

-- CreateEnum
CREATE TYPE "ProjectStatusT" AS ENUM ('IN_PROGRESS', 'WAITING_FOR_EVALUATION', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProjectMemberStatusT" AS ENUM ('ACTIVE', 'REMOVED');

-- CreateEnum
CREATE TYPE "DefenseCommitteeStatusT" AS ENUM ('PREPARING', 'SCHEDULED', 'ONGOING', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DefenseCommitteeRoleT" AS ENUM ('CHAIRMAN', 'SECRETARY', 'REVIEWER', 'MEMBER');

-- CreateEnum
CREATE TYPE "ProjectEvaluationStatusT" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "FileT" AS ENUM ('PDF', 'WORD', 'PRESENTATION', 'SPREADSHEET', 'AUTOCAD', 'IMAGE', 'VIDEO', 'CODE', 'DATASET', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'WARNING', 'DEADLINE', 'TASK_ASSIGNED', 'COMMENT_MENTION', 'PROPOSAL_STATUS_CHANGE', 'OUTLINE_STATUS_CHANGE', 'REPORT_STATUS_CHANGE', 'REVISION_REQUEST', 'GRADE_AVAILABLE', 'MEETING_SCHEDULED', 'SYSTEM_UPDATE', 'CUSTOM');

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "student_code" TEXT NOT NULL,
    "major_code" TEXT,
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
    "refresh_token" TEXT,
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
    "refresh_token" TEXT,

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
    "long_description" TEXT,
    "status" "FieldPoolStatusT" NOT NULL DEFAULT 'CLOSED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "registration_deadline" TIMESTAMP(3),

    CONSTRAINT "field_pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_pool_department" (
    "field_pool_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,

    CONSTRAINT "field_pool_department_pkey" PRIMARY KEY ("field_pool_id","department_id")
);

-- CreateTable
CREATE TABLE "field_pool_domain" (
    "field_pool_id" TEXT NOT NULL,
    "domain_id" TEXT NOT NULL,

    CONSTRAINT "field_pool_domain_pkey" PRIMARY KEY ("field_pool_id","domain_id")
);

-- CreateTable
CREATE TABLE "domain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

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
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "lecturer_selection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_selection" (
    "id" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "topic_title" TEXT,
    "description" TEXT,
    "status" "StudentSelectionStatusT" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "student_id" TEXT NOT NULL,
    "lecturer_id" TEXT,
    "field_pool_id" TEXT,
    "preferred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_by_faculty_id" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "student_selection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_allocation" (
    "id" TEXT NOT NULL,
    "topic_title" TEXT NOT NULL,
    "allocatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "student_id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "lecturer_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "project_allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposed_project" (
    "id" TEXT NOT NULL,
    "project_allocation_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProposedProjectStatusT" NOT NULL DEFAULT 'TOPIC_SUBMISSION_PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "proposal_deadline" TIMESTAMP(3),
    "topic_lock_date" TIMESTAMP(3),
    "approved_at" TIMESTAMP(3),
    "approved_by_id" TEXT,
    "created_by_student_id" TEXT,
    "created_by_faculty_id" TEXT,
    "field_pool_id" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "proposalOutlineId" TEXT,

    CONSTRAINT "proposed_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposed_project_member" (
    "id" TEXT NOT NULL,
    "proposed_project_id" TEXT NOT NULL,
    "student_id" TEXT,
    "faculty_id" TEXT,
    "role" TEXT,
    "status" "ProposedProjectMemberStatusT" NOT NULL DEFAULT 'ACTIVE',
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposed_project_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposed_project_comment" (
    "id" TEXT NOT NULL,
    "commenter_student_id" TEXT,
    "commenter_faculty_id" TEXT,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proposed_project_id" TEXT NOT NULL,

    CONSTRAINT "proposed_project_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_outline" (
    "id" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "methodology" TEXT NOT NULL,
    "expected_results" TEXT NOT NULL,
    "file_id" TEXT,
    "status" "ProposalStatusT" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "project_id" TEXT,

    CONSTRAINT "proposal_outline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "type" "ProjectT" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "field" TEXT NOT NULL,
    "status" "ProjectStatusT" NOT NULL DEFAULT 'IN_PROGRESS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "proposal_deadline" TIMESTAMP(3),
    "topic_lock_date" TIMESTAMP(3),
    "custom_fields" JSONB,
    "approved_by_id" TEXT NOT NULL,
    "department_id" TEXT,
    "field_pool_id" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_member" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "member_student_id" TEXT,
    "member_faculty_id" TEXT,
    "role_description" TEXT,
    "status" "ProjectMemberStatusT" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "project_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "project_id" TEXT NOT NULL,
    "commenter_student_id" TEXT,
    "commenter_faculty_id" TEXT,

    CONSTRAINT "project_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_domain" (
    "project_id" TEXT NOT NULL,
    "domain_id" TEXT NOT NULL,

    CONSTRAINT "project_domain_pkey" PRIMARY KEY ("project_id","domain_id")
);

-- CreateTable
CREATE TABLE "project_final_report" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "main_report_file_id" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "studentId" TEXT,
    "facultyId" TEXT,

    CONSTRAINT "project_final_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_attachment" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "description" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_report_comment" (
    "id" TEXT NOT NULL,
    "final_report_id" TEXT NOT NULL,
    "commenter_student_id" TEXT,
    "commenter_faculty_id" TEXT,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "project_report_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defense_committee" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defense_date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "status" "DefenseCommitteeStatusT" NOT NULL DEFAULT 'PREPARING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "defense_committee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defense_committee_member" (
    "id" TEXT NOT NULL,
    "role" "DefenseCommitteeRoleT" NOT NULL,
    "defense_committee_id" TEXT NOT NULL,
    "faculty_member_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "defense_committee_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_evaluation" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "final_score" DOUBLE PRECISION,
    "grade" TEXT,
    "status" "ProjectEvaluationStatusT" NOT NULL DEFAULT 'PENDING',
    "evaluated_by_id" TEXT,
    "advisor_score" DOUBLE PRECISION,
    "committee_average_score" DOUBLE PRECISION,
    "advisor_weight" DOUBLE PRECISION DEFAULT 0.5,
    "committee_weight" DOUBLE PRECISION DEFAULT 0.5,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "project_evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_criteria_score" (
    "id" TEXT NOT NULL,
    "evaluation_id" TEXT NOT NULL,
    "criteria_id" TEXT NOT NULL,
    "evaluator_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "comment" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "project_criteria_score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_criteria" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "evaluation_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "file_url" TEXT,
    "file_path" TEXT,
    "file_type" "FileT" NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "checksum" TEXT,
    "uploaded_by_student_id" TEXT,
    "uploaded_by_faculty_id" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_accessed" TIMESTAMP(3),
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "action" TEXT NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "department_id" TEXT,
    "action_by_student_id" TEXT,
    "action_by_faculty_id" TEXT,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "recipient_student_id" TEXT,
    "recipient_faculty_id" TEXT,
    "sender_student_id" TEXT,
    "sender_faculty_id" TEXT,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "related_entity_type" TEXT,
    "related_entity_id" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_student_code_key" ON "student"("student_code");

-- CreateIndex
CREATE UNIQUE INDEX "student_email_key" ON "student"("email");

-- CreateIndex
CREATE INDEX "student_student_code_status_department_id_idx" ON "student"("student_code", "status", "department_id");

-- CreateIndex
CREATE INDEX "student_email_status_idx" ON "student"("email", "status");

-- CreateIndex
CREATE INDEX "student_department_id_status_idx" ON "student"("department_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_faculty_member_code_key" ON "faculty"("faculty_member_code");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_email_key" ON "faculty"("email");

-- CreateIndex
CREATE INDEX "faculty_faculty_member_code_status_department_id_idx" ON "faculty"("faculty_member_code", "status", "department_id");

-- CreateIndex
CREATE INDEX "faculty_email_status_idx" ON "faculty"("email", "status");

-- CreateIndex
CREATE INDEX "faculty_department_id_status_idx" ON "faculty"("department_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_role_faculty_id_role_key" ON "faculty_role"("faculty_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "field_pool_name_key" ON "field_pool"("name");

-- CreateIndex
CREATE UNIQUE INDEX "domain_name_key" ON "domain"("name");

-- CreateIndex
CREATE UNIQUE INDEX "lecturer_selection_lecturer_id_topic_title_field_pool_id_key" ON "lecturer_selection"("lecturer_id", "topic_title", "field_pool_id");

-- CreateIndex
CREATE INDEX "student_selection_student_id_priority_idx" ON "student_selection"("student_id", "priority");

-- CreateIndex
CREATE INDEX "student_selection_lecturer_id_created_at_status_idx" ON "student_selection"("lecturer_id", "created_at", "status");

-- CreateIndex
CREATE UNIQUE INDEX "student_selection_student_id_field_pool_id_priority_key" ON "student_selection"("student_id", "field_pool_id", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "student_selection_student_id_field_pool_id_lecturer_id_key" ON "student_selection"("student_id", "field_pool_id", "lecturer_id");

-- CreateIndex
CREATE INDEX "project_allocation_student_id_lecturer_id_allocatedAt_idx" ON "project_allocation"("student_id", "lecturer_id", "allocatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "project_allocation_student_id_lecturer_id_topic_title_key" ON "project_allocation"("student_id", "lecturer_id", "topic_title");

-- CreateIndex
CREATE UNIQUE INDEX "proposed_project_project_allocation_id_key" ON "proposed_project"("project_allocation_id");

-- CreateIndex
CREATE UNIQUE INDEX "proposal_outline_file_id_key" ON "proposal_outline"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "proposal_outline_project_id_key" ON "proposal_outline"("project_id");

-- CreateIndex
CREATE INDEX "project_type_status_department_id_created_at_idx" ON "project"("type", "status", "department_id", "created_at");

-- CreateIndex
CREATE INDEX "project_approved_by_id_status_created_at_idx" ON "project"("approved_by_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "project_department_id_type_status_idx" ON "project"("department_id", "type", "status");

-- CreateIndex
CREATE INDEX "project_member_project_id_idx" ON "project_member"("project_id");

-- CreateIndex
CREATE INDEX "project_member_member_student_id_idx" ON "project_member"("member_student_id");

-- CreateIndex
CREATE INDEX "project_member_member_faculty_id_idx" ON "project_member"("member_faculty_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_member_project_id_member_student_id_key" ON "project_member"("project_id", "member_student_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_member_project_id_member_faculty_id_key" ON "project_member"("project_id", "member_faculty_id");

-- CreateIndex
CREATE INDEX "project_comment_project_id_created_at_idx" ON "project_comment"("project_id", "created_at");

-- CreateIndex
CREATE INDEX "project_comment_commenter_student_id_idx" ON "project_comment"("commenter_student_id");

-- CreateIndex
CREATE INDEX "project_comment_commenter_faculty_id_idx" ON "project_comment"("commenter_faculty_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_final_report_main_report_file_id_key" ON "project_final_report"("main_report_file_id");

-- CreateIndex
CREATE INDEX "project_final_report_project_id_idx" ON "project_final_report"("project_id");

-- CreateIndex
CREATE INDEX "report_attachment_report_id_idx" ON "report_attachment"("report_id");

-- CreateIndex
CREATE INDEX "report_attachment_file_id_idx" ON "report_attachment"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "report_attachment_report_id_file_id_key" ON "report_attachment"("report_id", "file_id");

-- CreateIndex
CREATE INDEX "project_report_comment_final_report_id_idx" ON "project_report_comment"("final_report_id");

-- CreateIndex
CREATE UNIQUE INDEX "defense_committee_project_id_key" ON "defense_committee"("project_id");

-- CreateIndex
CREATE INDEX "defense_committee_defense_date_idx" ON "defense_committee"("defense_date");

-- CreateIndex
CREATE INDEX "defense_committee_project_id_idx" ON "defense_committee"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "defense_committee_member_defense_committee_id_faculty_membe_key" ON "defense_committee_member"("defense_committee_id", "faculty_member_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_evaluation_project_id_key" ON "project_evaluation"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_criteria_score_evaluation_id_criteria_id_evaluator__key" ON "project_criteria_score"("evaluation_id", "criteria_id", "evaluator_id");

-- CreateIndex
CREATE UNIQUE INDEX "evaluation_criteria_name_key" ON "evaluation_criteria"("name");

-- CreateIndex
CREATE INDEX "file_file_type_uploadedAt_idx" ON "file"("file_type", "uploadedAt");

-- CreateIndex
CREATE INDEX "file_uploaded_by_student_id_idx" ON "file"("uploaded_by_student_id");

-- CreateIndex
CREATE INDEX "file_uploaded_by_faculty_id_idx" ON "file"("uploaded_by_faculty_id");

-- CreateIndex
CREATE INDEX "audit_log_entity_type_entity_id_created_at_idx" ON "audit_log"("entity_type", "entity_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_log_action_by_student_id_idx" ON "audit_log"("action_by_student_id");

-- CreateIndex
CREATE INDEX "audit_log_action_by_faculty_id_idx" ON "audit_log"("action_by_faculty_id");

-- CreateIndex
CREATE INDEX "audit_log_action_created_at_idx" ON "audit_log"("action", "created_at");

-- CreateIndex
CREATE INDEX "notification_recipient_student_id_is_read_created_at_idx" ON "notification"("recipient_student_id", "is_read", "created_at");

-- CreateIndex
CREATE INDEX "notification_recipient_faculty_id_is_read_created_at_idx" ON "notification"("recipient_faculty_id", "is_read", "created_at");

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
ALTER TABLE "field_pool_domain" ADD CONSTRAINT "field_pool_domain_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_pool_domain" ADD CONSTRAINT "field_pool_domain_field_pool_id_fkey" FOREIGN KEY ("field_pool_id") REFERENCES "field_pool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_selection" ADD CONSTRAINT "lecturer_selection_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_selection" ADD CONSTRAINT "lecturer_selection_field_pool_id_fkey" FOREIGN KEY ("field_pool_id") REFERENCES "field_pool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_selection" ADD CONSTRAINT "student_selection_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_selection" ADD CONSTRAINT "student_selection_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_selection" ADD CONSTRAINT "student_selection_field_pool_id_fkey" FOREIGN KEY ("field_pool_id") REFERENCES "field_pool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_selection" ADD CONSTRAINT "student_selection_approved_by_faculty_id_fkey" FOREIGN KEY ("approved_by_faculty_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_allocation" ADD CONSTRAINT "project_allocation_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_allocation" ADD CONSTRAINT "project_allocation_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_allocation" ADD CONSTRAINT "project_allocation_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project" ADD CONSTRAINT "proposed_project_project_allocation_id_fkey" FOREIGN KEY ("project_allocation_id") REFERENCES "project_allocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project" ADD CONSTRAINT "proposed_project_created_by_student_id_fkey" FOREIGN KEY ("created_by_student_id") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project" ADD CONSTRAINT "proposed_project_created_by_faculty_id_fkey" FOREIGN KEY ("created_by_faculty_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project" ADD CONSTRAINT "proposed_project_proposalOutlineId_fkey" FOREIGN KEY ("proposalOutlineId") REFERENCES "proposal_outline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project" ADD CONSTRAINT "proposed_project_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project" ADD CONSTRAINT "proposed_project_field_pool_id_fkey" FOREIGN KEY ("field_pool_id") REFERENCES "field_pool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project_member" ADD CONSTRAINT "proposed_project_member_proposed_project_id_fkey" FOREIGN KEY ("proposed_project_id") REFERENCES "proposed_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project_member" ADD CONSTRAINT "proposed_project_member_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project_member" ADD CONSTRAINT "proposed_project_member_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project_comment" ADD CONSTRAINT "proposed_project_comment_proposed_project_id_fkey" FOREIGN KEY ("proposed_project_id") REFERENCES "proposed_project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project_comment" ADD CONSTRAINT "proposed_project_comment_commenter_student_id_fkey" FOREIGN KEY ("commenter_student_id") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposed_project_comment" ADD CONSTRAINT "proposed_project_comment_commenter_faculty_id_fkey" FOREIGN KEY ("commenter_faculty_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_outline" ADD CONSTRAINT "proposal_outline_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_outline" ADD CONSTRAINT "proposal_outline_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_field_pool_id_fkey" FOREIGN KEY ("field_pool_id") REFERENCES "field_pool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_member" ADD CONSTRAINT "project_member_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_member" ADD CONSTRAINT "project_member_member_student_id_fkey" FOREIGN KEY ("member_student_id") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_member" ADD CONSTRAINT "project_member_member_faculty_id_fkey" FOREIGN KEY ("member_faculty_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_comment" ADD CONSTRAINT "project_comment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_comment" ADD CONSTRAINT "project_comment_commenter_student_id_fkey" FOREIGN KEY ("commenter_student_id") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_comment" ADD CONSTRAINT "project_comment_commenter_faculty_id_fkey" FOREIGN KEY ("commenter_faculty_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_domain" ADD CONSTRAINT "project_domain_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_domain" ADD CONSTRAINT "project_domain_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_final_report" ADD CONSTRAINT "project_final_report_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_final_report" ADD CONSTRAINT "project_final_report_main_report_file_id_fkey" FOREIGN KEY ("main_report_file_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_final_report" ADD CONSTRAINT "project_final_report_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_final_report" ADD CONSTRAINT "project_final_report_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_attachment" ADD CONSTRAINT "report_attachment_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "project_final_report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_attachment" ADD CONSTRAINT "report_attachment_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_report_comment" ADD CONSTRAINT "project_report_comment_final_report_id_fkey" FOREIGN KEY ("final_report_id") REFERENCES "project_final_report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_report_comment" ADD CONSTRAINT "project_report_comment_commenter_student_id_fkey" FOREIGN KEY ("commenter_student_id") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_report_comment" ADD CONSTRAINT "project_report_comment_commenter_faculty_id_fkey" FOREIGN KEY ("commenter_faculty_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_committee" ADD CONSTRAINT "defense_committee_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_committee" ADD CONSTRAINT "defense_committee_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_committee_member" ADD CONSTRAINT "defense_committee_member_defense_committee_id_fkey" FOREIGN KEY ("defense_committee_id") REFERENCES "defense_committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_committee_member" ADD CONSTRAINT "defense_committee_member_faculty_member_id_fkey" FOREIGN KEY ("faculty_member_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_evaluation" ADD CONSTRAINT "project_evaluation_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_evaluation" ADD CONSTRAINT "project_evaluation_evaluated_by_id_fkey" FOREIGN KEY ("evaluated_by_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_criteria_score" ADD CONSTRAINT "project_criteria_score_criteria_id_fkey" FOREIGN KEY ("criteria_id") REFERENCES "evaluation_criteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_criteria_score" ADD CONSTRAINT "project_criteria_score_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "project_evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_criteria_score" ADD CONSTRAINT "project_criteria_score_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_criteria" ADD CONSTRAINT "evaluation_criteria_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_uploaded_by_student_id_fkey" FOREIGN KEY ("uploaded_by_student_id") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_uploaded_by_faculty_id_fkey" FOREIGN KEY ("uploaded_by_faculty_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_action_by_student_id_fkey" FOREIGN KEY ("action_by_student_id") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_action_by_faculty_id_fkey" FOREIGN KEY ("action_by_faculty_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_recipient_student_id_fkey" FOREIGN KEY ("recipient_student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_recipient_faculty_id_fkey" FOREIGN KEY ("recipient_faculty_id") REFERENCES "faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_sender_student_id_fkey" FOREIGN KEY ("sender_student_id") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_sender_faculty_id_fkey" FOREIGN KEY ("sender_faculty_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
