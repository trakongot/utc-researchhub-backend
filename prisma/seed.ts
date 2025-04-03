import {
  DepartmentStatusT,
  FacultyRoleT,
  FacultyStatusT,
  FieldPoolStatusT,
  GenderT,
  LecturerSelectionStatusT,
  PrismaClient,
  ProposedProjectStatusT,
  StudentSelectionStatusT,
  StudentStatusT,
  UserT,
} from '@prisma/client';
import { uuidv7 } from 'uuidv7';

const prisma = new PrismaClient();

// Fixed departments data
const departments = [
  {
    id: uuidv7(),
    departmentCode: 'CNTT',
    name: 'Công nghệ thông tin',
    description: 'Khoa Công nghệ thông tin UTC',
    status: DepartmentStatusT.ACTIVE,
  },
  {
    id: uuidv7(),
    departmentCode: 'COKHI',
    name: 'Cơ khí',
    description: 'Khoa Cơ khí UTC',
    status: DepartmentStatusT.ACTIVE,
  },
  {
    id: uuidv7(),
    departmentCode: 'XAYDUNG',
    name: 'Xây dựng',
    description: 'Khoa Xây dựng UTC',
    status: DepartmentStatusT.ACTIVE,
  },
  {
    id: uuidv7(),
    departmentCode: 'KTDN',
    name: 'Kinh tế và Đầu tư',
    description: 'Khoa Kinh tế và Đầu tư UTC',
    status: DepartmentStatusT.ACTIVE,
  },
];

// Fixed faculty data
const faculties = [
  {
    id: uuidv7(),
    facultyCode: '123456',
    fullName: 'Nguyễn Văn Anh',
    email: 'nvanh@utc.edu.vn',
    password: '$2b$10$4.v0PpOy321jeadGqnu2Run3f8nUAsBgZcff6zhZsRoiCf0ltx5C6',
    phoneNumber: '0912345678',
    rank: 'TS',
    status: FacultyStatusT.ACTIVE,
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    lastLogin: new Date(),
    isOnline: true,
    departmentId: null,
    bio: 'Tiến sĩ Khoa học Máy tính tại Đại học Quốc gia Hà Nội',
  },
  {
    id: uuidv7(),
    facultyCode: 'GV002',
    fullName: 'Trần Thị Bình',
    email: 'ttbinh@utc.edu.vn',
    password: '$2b$10$4.v0PpOy321jeadGqnu2Run3f8nUAsBgZcff6zhZsRoiCf0ltx5C6',
    phoneNumber: '0912345679',
    rank: 'PGS',
    status: FacultyStatusT.ACTIVE,
    profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg',
    lastLogin: new Date(),
    isOnline: false,
    departmentId: null,
    bio: 'Phó giáo sư ngành Kỹ thuật phần mềm với 15 năm kinh nghiệm',
  },
  {
    id: uuidv7(),
    facultyCode: 'GV003',
    fullName: 'Lê Văn Công',
    email: 'lvcong@utc.edu.vn',
    password: '$2b$10$4.v0PpOy321jeadGqnu2Run3f8nUAsBgZcff6zhZsRoiCf0ltx5C6',
    phoneNumber: '0912345680',
    rank: 'ThS',
    status: FacultyStatusT.ACTIVE,
    profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
    lastLogin: new Date(),
    isOnline: true,
    departmentId: null,
    bio: 'Thạc sĩ Kỹ thuật phần mềm với chuyên môn về AI và Machine Learning',
  },
  {
    id: uuidv7(),
    facultyCode: 'GV004',
    fullName: 'Phạm Thị Dung',
    email: 'ptdung@utc.edu.vn',
    password: '$2b$10$4.v0PpOy321jeadGqnu2Run3f8nUAsBgZcff6zhZsRoiCf0ltx5C6',
    phoneNumber: '0912345681',
    rank: 'TS',
    status: FacultyStatusT.ACTIVE,
    profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
    lastLogin: new Date(),
    isOnline: false,
    departmentId: null,
    bio: 'Tiến sĩ Mạng máy tính và Truyền thông dữ liệu',
  },
  {
    id: uuidv7(),
    facultyCode: 'GV005',
    fullName: 'Hoàng Văn Ẩn',
    email: 'hvan@utc.edu.vn',
    password: 'Password123',
    phoneNumber: '0912345682',
    rank: 'GVC',
    status: FacultyStatusT.ACTIVE,
    profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
    lastLogin: new Date(),
    isOnline: true,
    departmentId: null,
    bio: 'Giảng viên chính với chuyên môn về Hệ thống thông tin và Cơ sở dữ liệu',
  },
];

// Fixed students data
const students = [
  {
    id: uuidv7(),
    studentCode: '123456',
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyenvan@utc.edu.vn',
    password: '$2b$10$4.v0PpOy321jeadGqnu2Run3f8nUAsBgZcff6zhZsRoiCf0ltx5C6',
    status: StudentStatusT.ACTIVE,
    profilePicture: 'https://randomuser.me/api/portraits/men/10.jpg',
    lastLogin: new Date(),
    isOnline: true,
    graduationYear: 2025,
    departmentId: null,
    majorCode: 'CNTT',
    programCode: 'CT1',
    admissionYear: 2021,
    currentGpa: 3.5,
    creditsEarned: 100,
    phone: '0987654321',
    dateOfBirth: new Date('2003-05-10'),
    gender: GenderT.MALE,
  },
  {
    id: uuidv7(),
    studentCode: '20110002',
    fullName: 'Trần Thị Bích',
    email: 'bich.tranthi@utc.edu.vn',
    password: 'Password123',
    status: StudentStatusT.ACTIVE,
    profilePicture: 'https://randomuser.me/api/portraits/women/10.jpg',
    lastLogin: new Date(),
    isOnline: false,
    graduationYear: 2025,
    departmentId: null,
    majorCode: 'CNTT',
    programCode: 'CT1',
    admissionYear: 2021,
    currentGpa: 3.7,
    creditsEarned: 102,
    phone: '0987654322',
    dateOfBirth: new Date('2003-07-15'),
    gender: GenderT.FEMALE,
  },
  {
    id: uuidv7(),
    studentCode: '20110003',
    fullName: 'Lê Văn Cường',
    email: 'cuong.levan@utc.edu.vn',
    password: 'Password123',
    status: StudentStatusT.ACTIVE,
    profilePicture: 'https://randomuser.me/api/portraits/men/11.jpg',
    lastLogin: new Date(),
    isOnline: true,
    graduationYear: 2025,
    departmentId: null,
    majorCode: 'CNTT',
    programCode: 'CT2',
    admissionYear: 2021,
    currentGpa: 3.2,
    creditsEarned: 98,
    phone: '0987654323',
    dateOfBirth: new Date('2003-01-20'),
    gender: GenderT.MALE,
  },
  {
    id: uuidv7(),
    studentCode: '20110004',
    fullName: 'Phạm Thị Duyên',
    email: 'duyen.phamthi@utc.edu.vn',
    password: 'Password123',
    status: StudentStatusT.ACTIVE,
    profilePicture: 'https://randomuser.me/api/portraits/women/11.jpg',
    lastLogin: new Date(),
    isOnline: false,
    graduationYear: 2025,
    departmentId: null,
    majorCode: 'CNTT',
    programCode: 'CT1',
    admissionYear: 2021,
    currentGpa: 3.9,
    creditsEarned: 105,
    phone: '0987654324',
    dateOfBirth: new Date('2003-03-25'),
    gender: GenderT.FEMALE,
  },
  {
    id: uuidv7(),
    studentCode: '20110005',
    fullName: 'Hoàng Văn Em',
    email: 'em.hoangvan@utc.edu.vn',
    password: 'Password123',
    status: StudentStatusT.ACTIVE,
    profilePicture: 'https://randomuser.me/api/portraits/men/12.jpg',
    lastLogin: new Date(),
    isOnline: true,
    graduationYear: 2025,
    departmentId: null,
    majorCode: 'CNTT',
    programCode: 'CT2',
    admissionYear: 2021,
    currentGpa: 3.1,
    creditsEarned: 95,
    phone: '0987654325',
    dateOfBirth: new Date('2003-11-05'),
    gender: GenderT.MALE,
  },
];

// Fixed field pools data
const fieldPools = [
  {
    id: uuidv7(),
    name: 'Trí tuệ nhân tạo',
    description: 'Nghiên cứu và ứng dụng AI trong các lĩnh vực',
    longDescription:
      'Nghiên cứu về machine learning, deep learning, và các ứng dụng của AI trong nhận dạng hình ảnh, xử lý ngôn ngữ tự nhiên và ra quyết định.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2024-12-31'),
  },
  {
    id: uuidv7(),
    name: 'Phát triển Web',
    description: 'Phát triển ứng dụng web và mobile',
    longDescription:
      'Nghiên cứu về các công nghệ web hiện đại, framework phổ biến và ứng dụng trong phát triển các hệ thống thông tin.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2024-12-31'),
  },
  {
    id: uuidv7(),
    name: 'Hệ thống thông tin',
    description: 'Phân tích, thiết kế và triển khai các hệ thống thông tin',
    longDescription:
      'Nghiên cứu về cách thiết kế, triển khai và quản lý các hệ thống thông tin phức tạp cho doanh nghiệp và tổ chức.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2024-12-31'),
  },
  {
    id: uuidv7(),
    name: 'An toàn thông tin',
    description: 'Bảo mật hệ thống và mạng máy tính',
    longDescription:
      'Nghiên cứu về các phương pháp bảo mật, phòng chống tấn công mạng và bảo vệ dữ liệu trong các hệ thống thông tin.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2024-12-31'),
  },
  {
    id: uuidv7(),
    name: 'IoT và Hệ thống nhúng',
    description: 'Internet of Things và các hệ thống nhúng',
    longDescription:
      'Nghiên cứu về các thiết bị thông minh kết nối, mạng cảm biến và ứng dụng trong các lĩnh vực như smart home, smart city.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2024-12-31'),
  },
];

// Fixed domains data
const domains = [
  {
    id: uuidv7(),
    name: 'Artificial Intelligence',
    description: 'Nghiên cứu và phát triển các hệ thống AI và máy học.',
  },
  {
    id: uuidv7(),
    name: 'Web Development',
    description:
      'Phát triển các ứng dụng web hiện đại với các công nghệ mới nhất.',
  },
  {
    id: uuidv7(),
    name: 'Mobile Development',
    description:
      'Phát triển ứng dụng di động cho các nền tảng như iOS và Android.',
  },
  {
    id: uuidv7(),
    name: 'Data Science',
    description: 'Phân tích và xử lý dữ liệu lớn để rút ra thông tin hữu ích.',
  },
  {
    id: uuidv7(),
    name: 'Cybersecurity',
    description: 'Bảo mật thông tin và phòng chống tấn công mạng.',
  },
  {
    id: uuidv7(),
    name: 'Internet of Things',
    description: 'Nghiên cứu về các thiết bị thông minh kết nối và ứng dụng.',
  },
  {
    id: uuidv7(),
    name: 'Cloud Computing',
    description: 'Công nghệ điện toán đám mây và ứng dụng trong kinh doanh.',
  },
  {
    id: uuidv7(),
    name: 'Blockchain',
    description: 'Nghiên cứu về công nghệ blockchain và ứng dụng.',
  },
];

// Faculty roles
const facultyRoles = [
  {
    id: uuidv7(),
    role: FacultyRoleT.ADMIN,
  },
  {
    id: uuidv7(),
    role: FacultyRoleT.DEAN,
  },
  {
    id: uuidv7(),
    role: FacultyRoleT.DEPARTMENT_HEAD,
  },
  {
    id: uuidv7(),
    role: FacultyRoleT.LECTURER,
  },
  {
    id: uuidv7(),
    role: FacultyRoleT.ADVISOR,
  },
];

// Predefined lecturer selections
const lecturerSelections = [
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Ứng dụng Deep Learning trong nhận dạng khuôn mặt',
    description:
      'Nghiên cứu và triển khai các giải thuật deep learning hiện đại trong việc nhận dạng khuôn mặt người với độ chính xác cao.',
    capacity: 3,
    currentCapacity: 0,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Xây dựng hệ thống quản lý học tập trực tuyến',
    description:
      'Phát triển một nền tảng học tập trực tuyến với đầy đủ các tính năng như quản lý khóa học, theo dõi tiến độ, và tương tác trực tiếp.',
    capacity: 2,
    currentCapacity: 0,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 2,
    topicTitle: 'Phân tích dữ liệu mạng xã hội để dự đoán xu hướng',
    description:
      'Thu thập và phân tích dữ liệu từ các nền tảng mạng xã hội để dự đoán xu hướng thị trường và hành vi người dùng.',
    capacity: 2,
    currentCapacity: 0,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 2,
    topicTitle: 'Phát triển ứng dụng di động sử dụng React Native',
    description:
      'Xây dựng ứng dụng di động đa nền tảng sử dụng React Native với hiệu suất cao và giao diện người dùng thân thiện.',
    capacity: 3,
    currentCapacity: 0,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 3,
    topicTitle: 'Xây dựng hệ thống IoT giám sát môi trường',
    description:
      'Thiết kế và triển khai hệ thống IoT để giám sát các thông số môi trường như nhiệt độ, độ ẩm, và chất lượng không khí.',
    capacity: 2,
    currentCapacity: 0,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
];

// Predefined evaluation criteria
const evaluationCriteria = [
  {
    id: uuidv7(),
    name: 'Chất lượng nghiên cứu',
    description:
      'Đánh giá mức độ nghiên cứu sâu, tính mới và giá trị học thuật',
    weight: 0.3,
  },
  {
    id: uuidv7(),
    name: 'Tính ứng dụng',
    description: 'Đánh giá khả năng áp dụng vào thực tế của đề tài',
    weight: 0.2,
  },
  {
    id: uuidv7(),
    name: 'Chất lượng triển khai',
    description: 'Đánh giá chất lượng của sản phẩm, code và tài liệu',
    weight: 0.25,
  },
  {
    id: uuidv7(),
    name: 'Kỹ năng thuyết trình',
    description: 'Đánh giá khả năng trình bày và bảo vệ đề tài',
    weight: 0.15,
  },
  {
    id: uuidv7(),
    name: 'Tính đổi mới',
    description: 'Đánh giá tính sáng tạo và đổi mới trong đề tài',
    weight: 0.1,
  },
];

// Main function to seed all data
async function main() {
  // Clear all existing data
  await prisma.$transaction([
    prisma.fieldPoolDomain.deleteMany({}),
    prisma.fieldPoolDepartment.deleteMany({}),
    prisma.projectCriteriaScore.deleteMany({}),
    prisma.projectEvaluationScore.deleteMany({}),
    prisma.projectEvaluation.deleteMany({}),
    prisma.evaluationCriteria.deleteMany({}),
    prisma.defenseMember.deleteMany({}),
    prisma.defenseCommittee.deleteMany({}),
    prisma.projectReportComment.deleteMany({}),
    prisma.projectReportFile.deleteMany({}),
    prisma.projectFinalReport.deleteMany({}),
    prisma.projectDomain.deleteMany({}),
    prisma.projectComment.deleteMany({}),
    prisma.projectMember.deleteMany({}),
    prisma.project.deleteMany({}),
    prisma.proposedProjectComment.deleteMany({}),
    prisma.proposedProject.deleteMany({}),
    prisma.proposalOutline.deleteMany({}),
    prisma.projectAllocation.deleteMany({}),
    prisma.studentSelection.deleteMany({}),
    prisma.lecturerSelection.deleteMany({}),
    prisma.facultyRole.deleteMany({}),
    prisma.domain.deleteMany({}),
    prisma.fieldPool.deleteMany({}),
    prisma.student.deleteMany({}),
    prisma.faculty.deleteMany({}),
    prisma.department.deleteMany({}),
    prisma.auditLog.deleteMany({}),
  ]);

  console.log('✅ Successfully cleared database!');
  console.log('Seeding database with fixed data...');

  // Create departments
  await prisma.department.createMany({ data: departments });
  console.log(`✅ Successfully seeded ${departments.length} departments!`);

  // Update faculty with department IDs
  const departmentsByCode: Record<string, string> = {};
  const seededDepartments = await prisma.department.findMany();

  seededDepartments.forEach((dept) => {
    if (dept.departmentCode) {
      departmentsByCode[dept.departmentCode] = dept.id;
    }
  });

  // Assign departments to faculty
  const facultiesWithDepts = faculties.map((faculty, index) => {
    const deptIndex = index % departments.length;
    return {
      ...faculty,
      departmentId: seededDepartments[deptIndex].id,
    };
  });

  // Create faculty
  await prisma.faculty.createMany({ data: facultiesWithDepts });
  console.log(
    `✅ Successfully seeded ${facultiesWithDepts.length} faculty members!`,
  );

  // Assign departments to students
  const studentsWithDepts = students.map((student, index) => {
    const deptIndex = index % departments.length;
    return {
      ...student,
      departmentId: seededDepartments[deptIndex].id,
    };
  });

  // Create students
  await prisma.student.createMany({ data: studentsWithDepts });
  console.log(`✅ Successfully seeded ${studentsWithDepts.length} students!`);

  // Create field pools
  await prisma.fieldPool.createMany({ data: fieldPools });
  console.log(`✅ Successfully seeded ${fieldPools.length} field pools!`);

  // Create domains
  await prisma.domain.createMany({ data: domains });
  console.log(`✅ Successfully seeded ${domains.length} domains!`);

  // Create faculty roles
  const seededFaculty = await prisma.faculty.findMany();

  const facultyRolesWithIds: Array<{
    id: string;
    facultyId: string;
    role: FacultyRoleT;
  }> = [];

  seededFaculty.forEach((faculty) => {
    // Assign LECTURER role to everyone
    facultyRolesWithIds.push({
      id: uuidv7(),
      facultyId: faculty.id,
      role: FacultyRoleT.LECTURER,
    });

    // Assign additional roles based on index
    if (faculty.facultyCode === 'GV001') {
      facultyRolesWithIds.push({
        id: uuidv7(),
        facultyId: faculty.id,
        role: FacultyRoleT.ADMIN,
      });
    }

    if (faculty.facultyCode === 'GV002') {
      facultyRolesWithIds.push({
        id: uuidv7(),
        facultyId: faculty.id,
        role: FacultyRoleT.DEAN,
      });
    }

    if (faculty.facultyCode === 'GV003') {
      facultyRolesWithIds.push({
        id: uuidv7(),
        facultyId: faculty.id,
        role: FacultyRoleT.DEPARTMENT_HEAD,
      });
    }
  });

  await prisma.facultyRole.createMany({ data: facultyRolesWithIds });
  console.log(
    `✅ Successfully seeded ${facultyRolesWithIds.length} faculty roles!`,
  );

  // Create field pool domains (linking field pools to domains)
  const seededFieldPools = await prisma.fieldPool.findMany();
  const seededDomains = await prisma.domain.findMany();

  const fieldPoolDomains: Array<{
    fieldPoolId: string;
    domainId: string;
  }> = [];

  seededFieldPools.forEach((fieldPool) => {
    // Assign relevant domains to each field pool based on their names
    const relevantDomains = seededDomains.filter((domain) => {
      if (
        fieldPool.name === 'Trí tuệ nhân tạo' &&
        (domain.name === 'Artificial Intelligence' ||
          domain.name === 'Data Science')
      ) {
        return true;
      }
      if (
        fieldPool.name === 'Phát triển Web' &&
        (domain.name === 'Web Development' || domain.name === 'Cloud Computing')
      ) {
        return true;
      }
      if (
        fieldPool.name === 'Hệ thống thông tin' &&
        (domain.name === 'Data Science' || domain.name === 'Cloud Computing')
      ) {
        return true;
      }
      if (
        fieldPool.name === 'An toàn thông tin' &&
        (domain.name === 'Cybersecurity' || domain.name === 'Blockchain')
      ) {
        return true;
      }
      if (
        fieldPool.name === 'IoT và Hệ thống nhúng' &&
        (domain.name === 'Internet of Things' ||
          domain.name === 'Artificial Intelligence')
      ) {
        return true;
      }
      return false;
    });

    relevantDomains.forEach((domain) => {
      fieldPoolDomains.push({
        fieldPoolId: fieldPool.id,
        domainId: domain.id,
      });
    });
  });

  await prisma.fieldPoolDomain.createMany({ data: fieldPoolDomains });
  console.log(
    `✅ Successfully seeded ${fieldPoolDomains.length} field pool domain links!`,
  );

  // Create field pool departments (linking field pools to departments)
  const fieldPoolDepartments: Array<{
    fieldPoolId: string;
    departmentId: string;
  }> = [];

  seededFieldPools.forEach((fieldPool) => {
    seededDepartments.forEach((dept) => {
      if (dept.departmentCode === 'CNTT') {
        fieldPoolDepartments.push({
          fieldPoolId: fieldPool.id,
          departmentId: dept.id,
        });
      }
    });
  });

  await prisma.fieldPoolDepartment.createMany({ data: fieldPoolDepartments });
  console.log(
    `✅ Successfully seeded ${fieldPoolDepartments.length} field pool department links!`,
  );

  // Create lecturer selections with actual faculty IDs and field pool IDs
  const lecturerSelectionsWithIds = lecturerSelections.map(
    (selection, index) => {
      return {
        ...selection,
        lecturerId: seededFaculty[index % seededFaculty.length].id,
        fieldPoolId: seededFieldPools[index % seededFieldPools.length].id,
      };
    },
  );

  await prisma.lecturerSelection.createMany({
    data: lecturerSelectionsWithIds,
  });
  console.log(
    `✅ Successfully seeded ${lecturerSelectionsWithIds.length} lecturer selections!`,
  );

  // Create student selections
  const seededStudents = await prisma.student.findMany();
  const seededLecturerSelections = await prisma.lecturerSelection.findMany();

  const studentSelections: Array<{
    id: string;
    priority: number;
    topicTitle: string;
    status: StudentSelectionStatusT;
    studentId: string;
    lecturerId: string;
    fieldPoolId: string;
    preferredAt: Date;
    approvedById: string;
    approvedByType: UserT;
  }> = [];

  seededStudents.forEach((student, index) => {
    // Create 1-3 selections for each student
    const numSelections = (index % 3) + 1;

    for (let i = 0; i < numSelections; i++) {
      const lecturerSelection =
        seededLecturerSelections[(index + i) % seededLecturerSelections.length];
      const fieldPool = seededFieldPools[index % seededFieldPools.length];

      studentSelections.push({
        id: uuidv7(),
        priority: i + 1,
        topicTitle: `Đề tài nghiên cứu về ${fieldPool.name}`,
        status: StudentSelectionStatusT.PENDING,
        studentId: student.id,
        lecturerId: lecturerSelection.lecturerId,
        fieldPoolId: fieldPool.id,
        preferredAt: new Date(),
        approvedById: lecturerSelection.lecturerId,
        approvedByType: UserT.FACULTY,
      });
    }
  });

  await prisma.studentSelection.createMany({ data: studentSelections });
  console.log(
    `✅ Successfully seeded ${studentSelections.length} student selections!`,
  );

  // Create project allocations
  const projectAllocations: Array<{
    id: string;
    topicTitle: string;
    allocatedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    studentId: string;
    createdById: string;
    lecturerId: string;
  }> = [];

  // Only create allocations for existing students and faculty
  const numAllocations = Math.min(seededStudents.length, seededFaculty.length);

  for (let i = 0; i < numAllocations; i++) {
    const student = seededStudents[i];
    const lecturer = seededFaculty[i % seededFaculty.length];
    const fieldPool = seededFieldPools[i % seededFieldPools.length];

    if (student && lecturer && fieldPool) {
      projectAllocations.push({
        id: uuidv7(),
        topicTitle: `Đồ án về ${fieldPool.name}`,
        allocatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        studentId: student.id,
        createdById: lecturer.id,
        lecturerId: lecturer.id,
      });
    }
  }

  await prisma.projectAllocation.createMany({ data: projectAllocations });
  console.log(
    `✅ Successfully seeded ${projectAllocations.length} project allocations!`,
  );

  // Create evaluation criteria
  const evaluationCriteriaWithIds = evaluationCriteria.map((criteria) => ({
    ...criteria,
    createdById: seededFaculty[0].id, // First faculty member creates all criteria
  }));

  await prisma.evaluationCriteria.createMany({
    data: evaluationCriteriaWithIds,
  });
  console.log(
    `✅ Successfully seeded ${evaluationCriteriaWithIds.length} evaluation criteria!`,
  );

  // Create proposed projects
  const proposedProjects: Array<{
    id: string;
    title: string;
    description: string;
    createdById: string;
    creatorType: UserT;
    fieldPoolId: string;
    status: ProposedProjectStatusT;
    createdAt: Date;
    updatedAt: Date;
  }> = [];

  // Create proposed projects based on lecturer selections
  for (let i = 0; i < Math.min(seededLecturerSelections.length, 10); i++) {
    const lecturerSelection = seededLecturerSelections[i];
    if (lecturerSelection.fieldPoolId) {
      proposedProjects.push({
        id: uuidv7(),
        title: lecturerSelection.topicTitle,
        description:
          lecturerSelection.description || 'Mô tả chi tiết về đề xuất dự án',
        createdById: lecturerSelection.lecturerId,
        creatorType: UserT.FACULTY,
        fieldPoolId: lecturerSelection.fieldPoolId,
        status: ProposedProjectStatusT.PENDING_ADVISOR,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  // Create student-initiated proposed projects to ensure we have projects from both types
  if (seededStudents.length > 0) {
    const studentProject = {
      id: uuidv7(),
      title: 'Đề xuất từ sinh viên',
      description: 'Dự án đề xuất bởi sinh viên',
      createdById: seededStudents[0].id,
      creatorType: UserT.STUDENT,
      fieldPoolId: seededFieldPools[0].id,
      status: ProposedProjectStatusT.PENDING_ADVISOR,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    proposedProjects.push(studentProject);
  }

  // console.log(
  //   `⚠️ Skipping ProposedProject seeding due to foreign key constraints. Would have seeded ${proposedProjects.length} proposed projects.`,
  // );

  // // Skip creating proposed project comments since we don't have proposed projects
  // console.log(`⚠️ Skipping ProposedProjectComment seeding.`);

  // // Initialize empty arrays for skipped entities to avoid reference errors
  // const seededProposedProjects: any[] = [];
  // const seededProjects: any[] = [];
  // const seededEvaluations: any[] = [];

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
