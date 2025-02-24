-- Insert fake students
INSERT INTO "Students" (id, student_code, full_name, email, password, status, created_at, updated_at)
VALUES
  ('1', 'STU001', 'Nguyen Van A', 'nguyenvana@example.com', 'hashed_password', 'ACTIVE', NOW(), NOW()),
  ('2', 'STU002', 'Tran Thi B', 'tranthib@example.com', 'hashed_password', 'ACTIVE', NOW(), NOW()),
  ('3', 'STU003', 'Le Van C', 'levanc@example.com', 'hashed_password', 'ACTIVE', NOW(), NOW());

-- Insert fake faculty members
INSERT INTO "FacultyMembers" (id, full_name, faculty_member_code, email, password, status, created_at, updated_at)
VALUES
  ('1', 'Dr. Pham Van D', 'FAC001', 'phamvand@example.com', 'hashed_password', 'ACTIVE', NOW(), NOW()),
  ('2', 'Dr. Nguyen Thi E', 'FAC002', 'nguyenthie@example.com', 'hashed_password', 'ACTIVE', NOW(), NOW());

-- Insert faculty roles
INSERT INTO "FacultyRoles" (id, faculty_member_id, role)
VALUES
  ('1', '1', 'LECTURER'),
  ('2', '2', 'ADVISOR');

-- Insert lecture preferences
INSERT INTO "LecturecPreferences" (id, position, field, sub_field, topic_title, lecturer_id, created_at, updated_at)
VALUES
  ('1', 1, 'Machine Learning', 'Deep Learning', 'AI-based Image Recognition', '1', NOW(), NOW()),
  ('2', 2, 'Software Engineering', 'Microservices', 'Building Scalable Applications', '2', NOW(), NOW());

-- Insert student advisor preferences
INSERT INTO "StudentAdvisorPreferences" (id, topic_title, student_id, faculty_member_id, preferred_at, created_at, updated_at)
VALUES
  ('1', 'AI-based Image Recognition', '1', '1', NOW(), NOW(), NOW()),
  ('2', 'Building Scalable Applications', '2', '2', NOW(), NOW(), NOW());

-- Insert faculty member graduate project allocation
INSERT INTO "FacultyMemberGraduateProjectAllocation" (id, topic_title, student_id, lecturer_id, allocated_at, created_at, updated_at)
VALUES
  ('1', 'AI-based Image Recognition', '1', '1', NOW(), NOW(), NOW()),
  ('2', 'Building Scalable Applications', '2', '2', NOW(), NOW(), NOW());

-- Insert academic departments
INSERT INTO "AcademicDepartments" (id, code, name, description, status, created_at, updated_at)
VALUES
  ('1', 'CS', 'Computer Science', 'Department of Computer Science', 'ACTIVE', NOW(), NOW()),
  ('2', 'EE', 'Electrical Engineering', 'Department of Electrical Engineering', 'ACTIVE', NOW(), NOW()),
  ('3', 'ME', 'Mechanical Engineering', 'Department of Mechanical Engineering', 'ACTIVE', NOW(), NOW());
