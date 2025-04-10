// prisma/seed.ts
import {
  DepartmentStatusT,
  FacultyRoleT,
  FacultyStatusT,
  FieldPoolStatusT,
  GenderT,
  LecturerSelectionStatusT,
  // NotificationType, // Bỏ import
  Prisma,
  PrismaClient,
  ProposedProjectStatusT,
  StudentSelectionStatusT,
  StudentStatusT,
  UserT,
} from '@prisma/client';
import { uuidv7 } from 'uuidv7';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// --- Dữ liệu cố định (Mở rộng) ---
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
    departmentCode: 'DIEN',
    name: 'Điện - Điện tử',
    description: 'Khoa Điện - Điện tử UTC',
    status: DepartmentStatusT.ACTIVE,
  },
  {
    id: uuidv7(),
    departmentCode: 'XAYDUNG',
    name: 'Xây dựng',
    description: 'Khoa Xây dựng UTC',
    status: DepartmentStatusT.ACTIVE,
  },
];

const faculties = [
  // CNTT Faculty
  {
    id: uuidv7(), facultyCode: 'GV001', fullName: 'Nguyễn Văn Anh (Dean)', email: 'nvanh@utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', rank: 'TS', status: FacultyStatusT.ACTIVE, departmentId: null, bio: 'Trưởng khoa CNTT, chuyên ngành AI.'
  },
  {
    id: uuidv7(), facultyCode: 'GV002', fullName: 'Trần Thị Bình (Head)', email: 'ttbinh@utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', rank: 'PGS', status: FacultyStatusT.ACTIVE, departmentId: null, bio: 'Trưởng bộ môn KHMT, chuyên ngành SE.'
  },
  {
    id: uuidv7(), facultyCode: 'GV003', fullName: 'Lê Minh Cường (Advisor)', email: 'lmcuong@utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', rank: 'ThS', status: FacultyStatusT.ACTIVE, departmentId: null, bio: 'Giảng viên KHMT, cố vấn học tập.'
  },
  {
    id: uuidv7(), facultyCode: 'GV004', fullName: 'Phạm Thị Dung (Secretary)', email: 'ptdung@utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', rank: 'ThS', status: FacultyStatusT.ACTIVE, departmentId: null, bio: 'Giáo vụ khoa CNTT.'
  },
  // COKHI Faculty
  {
    id: uuidv7(), facultyCode: 'GV005', fullName: 'Hoàng Văn Em (Head)', email: 'hvem@utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', rank: 'TS', status: FacultyStatusT.ACTIVE, departmentId: null, bio: 'Trưởng bộ môn Cơ khí động lực.'
  },
  {
    id: uuidv7(), facultyCode: 'GV006', fullName: 'Vũ Thị Giang', email: 'vtgiang@utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', rank: 'ThS', status: FacultyStatusT.ACTIVE, departmentId: null, bio: 'Giảng viên Cơ khí chế tạo máy.'
  },
  // DIEN Faculty
  {
    id: uuidv7(), facultyCode: 'GV007', fullName: 'Đỗ Văn Hùng (Head)', email: 'dvhung@utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', rank: 'PGS.TS', status: FacultyStatusT.ACTIVE, departmentId: null, bio: 'Trưởng bộ môn Tự động hóa.'
  },
  {
    id: uuidv7(), facultyCode: 'GV008', fullName: 'Nguyễn Thị Kiều', email: 'ntkieu@utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', rank: 'TS', status: FacultyStatusT.ACTIVE, departmentId: null, bio: 'Giảng viên Hệ thống điện.'
  },
  // XAYDUNG Faculty
  {
    id: uuidv7(), facultyCode: 'GV009', fullName: 'Lê Văn Lâm (Head)', email: 'lvlam@utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', rank: 'TS', status: FacultyStatusT.ACTIVE, departmentId: null, bio: 'Trưởng bộ môn Cầu Hầm.'
  },
  {
    id: uuidv7(), facultyCode: 'GV010', fullName: 'Mai Thị Ngọc', email: 'mtngoc@utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', rank: 'ThS', status: FacultyStatusT.ACTIVE, departmentId: null, bio: 'Giảng viên Kết cấu công trình.'
  },
];

const students = [
  // CNTT Students
  { id: uuidv7(), studentCode: 'SVCNTT001', fullName: 'Nguyễn Văn An', email: 'an.nguyenvan@st.utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', status: StudentStatusT.ACTIVE, departmentId: null, admissionYear: 2021, currentGpa: 3.5, gender: GenderT.MALE, dateOfBirth: new Date('2003-05-10') },
  { id: uuidv7(), studentCode: 'SVCNTT002', fullName: 'Trần Thị Bích', email: 'bich.tranthi@st.utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', status: StudentStatusT.ACTIVE, departmentId: null, admissionYear: 2021, currentGpa: 3.7, gender: GenderT.FEMALE, dateOfBirth: new Date('2003-07-15') },
  { id: uuidv7(), studentCode: 'SVCNTT003', fullName: 'Lê Văn Cảnh', email: 'canh.levan@st.utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', status: StudentStatusT.ACTIVE, departmentId: null, admissionYear: 2022, currentGpa: 3.2, gender: GenderT.MALE, dateOfBirth: new Date('2004-01-20') },
  // COKHI Students
  { id: uuidv7(), studentCode: 'SVCK001', fullName: 'Phạm Thị Diệu', email: 'dieu.phamthi@st.utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', status: StudentStatusT.ACTIVE, departmentId: null, admissionYear: 2021, currentGpa: 3.1, gender: GenderT.FEMALE, dateOfBirth: new Date('2003-09-01') },
  { id: uuidv7(), studentCode: 'SVCK002', fullName: 'Hoàng Văn Biên', email: 'bien.hoangvan@st.utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', status: StudentStatusT.ACTIVE, departmentId: null, admissionYear: 2022, currentGpa: 3.0, gender: GenderT.MALE, dateOfBirth: new Date('2004-03-12') },
  // DIEN Students
  { id: uuidv7(), studentCode: 'SVDD001', fullName: 'Vũ Thị Hà', email: 'ha.vuthi@st.utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', status: StudentStatusT.ACTIVE, departmentId: null, admissionYear: 2021, currentGpa: 3.6, gender: GenderT.FEMALE, dateOfBirth: new Date('2003-11-25') },
  // XAYDUNG Students
  { id: uuidv7(), studentCode: 'SVXD001', fullName: 'Đỗ Văn Hưng', email: 'hung.dovan@st.utc.edu.vn', password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm', status: StudentStatusT.ACTIVE, departmentId: null, admissionYear: 2022, currentGpa: 3.3, gender: GenderT.MALE, dateOfBirth: new Date('2004-08-08') },
];

const fieldPools = [
  { id: uuidv7(), name: 'Trí tuệ nhân tạo (AI)', description: 'Nghiên cứu và ứng dụng AI.', status: FieldPoolStatusT.OPEN, registrationDeadline: new Date('2025-06-30') },
  { id: uuidv7(), name: 'Kỹ thuật phần mềm', description: 'Phát triển phần mềm và quy trình.', status: FieldPoolStatusT.OPEN, registrationDeadline: new Date('2025-06-30') },
  { id: uuidv7(), name: 'Cơ khí động lực', description: 'Nghiên cứu động cơ và hệ thống truyền lực.', status: FieldPoolStatusT.CLOSED },
  { id: uuidv7(), name: 'Tự động hóa', description: 'Thiết kế và điều khiển hệ thống tự động.', status: FieldPoolStatusT.OPEN, registrationDeadline: new Date('2025-06-30') },
  { id: uuidv7(), name: 'Kết cấu công trình', description: 'Phân tích và thiết kế kết cấu.', status: FieldPoolStatusT.OPEN, registrationDeadline: new Date('2025-06-30') },
];

const domains = [
  { id: uuidv7(), name: 'Machine Learning', description: 'Học máy' },
  { id: uuidv7(), name: 'Deep Learning', description: 'Học sâu' },
  { id: uuidv7(), name: 'Software Engineering', description: 'Công nghệ phần mềm' },
  { id: uuidv7(), name: 'Engine Design', description: 'Thiết kế động cơ' },
  { id: uuidv7(), name: 'Control Systems', description: 'Hệ thống điều khiển' },
  { id: uuidv7(), name: 'Structural Analysis', description: 'Phân tích kết cấu' },
];

const lecturerSelections = [
  // CNTT Selections
  { id: uuidv7(), priority: 1, topicTitle: 'Ứng dụng Deep Learning trong nhận dạng ảnh y tế', description: 'Nghiên cứu mô hình CNN cho chẩn đoán.', capacity: 2, status: LecturerSelectionStatusT.APPROVED, isActive: true },
  { id: uuidv7(), priority: 1, topicTitle: 'Xây dựng quy trình DevOps cho ứng dụng Microservices', description: 'Tích hợp CI/CD, giám sát.', capacity: 3, status: LecturerSelectionStatusT.APPROVED, isActive: true },
  // COKHI Selections
  { id: uuidv7(), priority: 1, topicTitle: 'Mô phỏng hệ thống phun nhiên liệu điện tử', description: 'Sử dụng phần mềm mô phỏng.', capacity: 2, status: LecturerSelectionStatusT.APPROVED, isActive: true },
  // DIEN Selections
  { id: uuidv7(), priority: 1, topicTitle: 'Thiết kế bộ điều khiển PID cho cánh tay robot', description: 'Điều khiển vị trí và tốc độ.', capacity: 3, status: LecturerSelectionStatusT.APPROVED, isActive: true },
  // XAYDUNG Selections
  { id: uuidv7(), priority: 1, topicTitle: 'Phân tích kết cấu cầu dây văng bằng phương pháp phần tử hữu hạn', description: 'Sử dụng SAP2000 hoặc Midas Civil.', capacity: 2, status: LecturerSelectionStatusT.APPROVED, isActive: true },
];

const evaluationCriteria = [
  { id: uuidv7(), name: 'Tính mới và sáng tạo', description: 'Mức độ mới lạ, độc đáo của đề tài.', weight: 0.15 },
  { id: uuidv7(), name: 'Cơ sở lý thuyết', description: 'Mức độ nắm vững và áp dụng lý thuyết.', weight: 0.20 },
  { id: uuidv7(), name: 'Phương pháp nghiên cứu', description: 'Tính hợp lý và khoa học của phương pháp.', weight: 0.25 },
  { id: uuidv7(), name: 'Kết quả đạt được', description: 'Mức độ hoàn thành mục tiêu, sản phẩm.', weight: 0.25 },
  { id: uuidv7(), name: 'Hình thức trình bày', description: 'Cách trình bày báo cáo, slide.', weight: 0.15 },
];
// --- Kết thúc Dữ liệu cố định ---

async function main() {
  console.log('Starting database seeding...');

  console.log('Clearing existing data...');
  await prisma.$transaction([
    // prisma.notification.deleteMany({}), // Bỏ Notification
    prisma.auditLog.deleteMany({}),
    prisma.fieldPoolDomain.deleteMany({}),
    prisma.fieldPoolDepartment.deleteMany({}),
    prisma.projectCriteriaScore.deleteMany({}),
    prisma.projectReportComment.deleteMany({}),
    prisma.projectReportFile.deleteMany({}),
    prisma.defenseMember.deleteMany({}),
    prisma.projectDomain.deleteMany({}),
    prisma.projectComment.deleteMany({}),
    prisma.projectMember.deleteMany({}),
    prisma.proposedProjectComment.deleteMany({}),
    prisma.projectAllocation.deleteMany({}),
    prisma.studentSelection.deleteMany({}),
    prisma.lecturerSelection.deleteMany({}),
    prisma.evaluationCriteria.deleteMany({}),
    prisma.projectEvaluation.deleteMany({}),
    prisma.defenseCommittee.deleteMany({}),
    prisma.projectFinalReport.deleteMany({}),
    prisma.project.deleteMany({}),
    prisma.proposedProject.deleteMany({}),
    prisma.proposalOutline.deleteMany({}),
    prisma.facultyRole.deleteMany({}),
    prisma.domain.deleteMany({}),
    prisma.fieldPool.deleteMany({}),
    prisma.student.deleteMany({}),
    prisma.faculty.deleteMany({}),
    prisma.department.deleteMany({}),
  ]);
  console.log('✅ Database cleared!');

  console.log('Wrapping seeding operations in a transaction...');
  try {
    await prisma.$transaction(async (tx) => {
  console.log('Seeding Departments...');
      await tx.department.createMany({ data: departments });
      const seededDepartments = await tx.department.findMany();
      const deptMap = new Map(seededDepartments.map(d => [d.departmentCode, d.id]));
  console.log(`✅ Seeded ${seededDepartments.length} departments.`);

  console.log('Seeding Faculty...');
      const facultiesWithDepts = faculties.map((faculty, index) => {
        let deptId: string | null = null;
        if (index < 4) deptId = deptMap.get('CNTT') || null; // First 4 are CNTT
        else if (index < 6) deptId = deptMap.get('COKHI') || null; // Next 2 are COKHI
        else if (index < 8) deptId = deptMap.get('DIEN') || null; // Next 2 are DIEN
        else deptId = deptMap.get('XAYDUNG') || null; // Last 2 are XAYDUNG
        return { ...faculty, departmentId: deptId };
      });
      await tx.faculty.createMany({ data: facultiesWithDepts });
      const seededFaculty = await tx.faculty.findMany();
  console.log(`✅ Seeded ${seededFaculty.length} faculty members.`);

  console.log('Seeding Students...');
      const studentsWithDepts = students.map((student) => {
         let deptId: string | null = null;
         if(student.studentCode.startsWith('SVCNTT')) deptId = deptMap.get('CNTT') || null;
         else if(student.studentCode.startsWith('SVCK')) deptId = deptMap.get('COKHI') || null;
         else if(student.studentCode.startsWith('SVDD')) deptId = deptMap.get('DIEN') || null;
         else if(student.studentCode.startsWith('SVXD')) deptId = deptMap.get('XAYDUNG') || null;
         return { ...student, departmentId: deptId };
      });
      await tx.student.createMany({ data: studentsWithDepts });
      const seededStudents = await tx.student.findMany();
  console.log(`✅ Seeded ${seededStudents.length} students.`);

  console.log('Seeding Field Pools...');
      await tx.fieldPool.createMany({ data: fieldPools });
      const seededFieldPools = await tx.fieldPool.findMany();
  console.log(`✅ Seeded ${seededFieldPools.length} field pools.`);

  console.log('Seeding Domains...');
      await tx.domain.createMany({ data: domains });
      const seededDomains = await tx.domain.findMany();
  console.log(`✅ Seeded ${seededDomains.length} domains.`);

      // --- Find Dean and Criteria Creator ONCE ---
      const dean = seededFaculty.find((f) => f.facultyCode === 'GV001');
      const criteriaCreator = dean || seededFaculty[0];

  console.log('Seeding Faculty Roles...');
      const facultyRolesData: Array<{ id: string; facultyId: string; role: FacultyRoleT }> = [];
      const facultyMap = new Map(seededFaculty.map(f => [f.facultyCode, f.id]));

      // Assign roles based on faculty code for clarity
      if (facultyMap.has('GV001')) facultyRolesData.push({ id: uuidv7(), facultyId: facultyMap.get('GV001')!, role: FacultyRoleT.DEAN });
      if (facultyMap.has('GV002')) facultyRolesData.push({ id: uuidv7(), facultyId: facultyMap.get('GV002')!, role: FacultyRoleT.DEPARTMENT_HEAD }); // CNTT Head
      if (facultyMap.has('GV003')) facultyRolesData.push({ id: uuidv7(), facultyId: facultyMap.get('GV003')!, role: FacultyRoleT.ADVISOR }); // CNTT Advisor
      if (facultyMap.has('GV004')) facultyRolesData.push({ id: uuidv7(), facultyId: facultyMap.get('GV004')!, role: FacultyRoleT.SECRETARY }); // CNTT Secretary
      if (facultyMap.has('GV005')) facultyRolesData.push({ id: uuidv7(), facultyId: facultyMap.get('GV005')!, role: FacultyRoleT.DEPARTMENT_HEAD }); // COKHI Head
      if (facultyMap.has('GV007')) facultyRolesData.push({ id: uuidv7(), facultyId: facultyMap.get('GV007')!, role: FacultyRoleT.DEPARTMENT_HEAD }); // DIEN Head
      if (facultyMap.has('GV009')) facultyRolesData.push({ id: uuidv7(), facultyId: facultyMap.get('GV009')!, role: FacultyRoleT.DEPARTMENT_HEAD }); // XAYDUNG Head

      // Assign LECTURER role to all faculty without a specific higher role yet
      seededFaculty.forEach(faculty => {
          if (!facultyRolesData.some(fr => fr.facultyId === faculty.id)) {
               facultyRolesData.push({ id: uuidv7(), facultyId: faculty.id, role: FacultyRoleT.LECTURER });
          }
      });

      await tx.facultyRole.createMany({ data: facultyRolesData });
  console.log(`✅ Seeded ${facultyRolesData.length} faculty roles.`);

  console.log('Seeding Field Pool Domains...');
      const fieldPoolDomainsData: Array<{ fieldPoolId: string; domainId: string }> = [];
      const aiPool = seededFieldPools.find(fp => fp.name.includes('AI'));
      const sePool = seededFieldPools.find(fp => fp.name.includes('phần mềm'));
      const enginePool = seededFieldPools.find(fp => fp.name.includes('động lực'));
      const autoPool = seededFieldPools.find(fp => fp.name.includes('Tự động hóa'));
      const structPool = seededFieldPools.find(fp => fp.name.includes('Kết cấu'));

      const mlDomain = seededDomains.find(d => d.name.includes('Machine Learning'));
      const dlDomain = seededDomains.find(d => d.name.includes('Deep Learning'));
      const seDomain = seededDomains.find(d => d.name.includes('Software Engineering'));
      const engineDomain = seededDomains.find(d => d.name.includes('Engine Design'));
      const controlDomain = seededDomains.find(d => d.name.includes('Control Systems'));
      const structDomain = seededDomains.find(d => d.name.includes('Structural Analysis'));

      if(aiPool && mlDomain) fieldPoolDomainsData.push({ fieldPoolId: aiPool.id, domainId: mlDomain.id });
      if(aiPool && dlDomain) fieldPoolDomainsData.push({ fieldPoolId: aiPool.id, domainId: dlDomain.id });
      if(sePool && seDomain) fieldPoolDomainsData.push({ fieldPoolId: sePool.id, domainId: seDomain.id });
      if(enginePool && engineDomain) fieldPoolDomainsData.push({ fieldPoolId: enginePool.id, domainId: engineDomain.id });
      if(autoPool && controlDomain) fieldPoolDomainsData.push({ fieldPoolId: autoPool.id, domainId: controlDomain.id });
      if(structPool && structDomain) fieldPoolDomainsData.push({ fieldPoolId: structPool.id, domainId: structDomain.id });

  if (fieldPoolDomainsData.length > 0) {
        await tx.fieldPoolDomain.createMany({ data: fieldPoolDomainsData });
        console.log(`✅ Seeded ${fieldPoolDomainsData.length} field pool domain links.`);
  } else {
    console.log('⚠️ No field pool domain links to seed.');
  }

  console.log('Seeding Field Pool Departments...');
      const fieldPoolDepartmentsData: Array<{ fieldPoolId: string; departmentId: string }> = [];
      if(aiPool && deptMap.has('CNTT')) fieldPoolDepartmentsData.push({ fieldPoolId: aiPool.id, departmentId: deptMap.get('CNTT')! });
      if(sePool && deptMap.has('CNTT')) fieldPoolDepartmentsData.push({ fieldPoolId: sePool.id, departmentId: deptMap.get('CNTT')! });
      if(enginePool && deptMap.has('COKHI')) fieldPoolDepartmentsData.push({ fieldPoolId: enginePool.id, departmentId: deptMap.get('COKHI')! });
      if(autoPool && deptMap.has('DIEN')) fieldPoolDepartmentsData.push({ fieldPoolId: autoPool.id, departmentId: deptMap.get('DIEN')! });
      if(structPool && deptMap.has('XAYDUNG')) fieldPoolDepartmentsData.push({ fieldPoolId: structPool.id, departmentId: deptMap.get('XAYDUNG')! });

      if (fieldPoolDepartmentsData.length > 0) {
        await tx.fieldPoolDepartment.createMany({ data: fieldPoolDepartmentsData });
        console.log(`✅ Seeded ${fieldPoolDepartmentsData.length} field pool department links.`);
  } else {
        console.log('⚠️ No field pool department links to seed.');
  }

  console.log('Seeding Lecturer Selections...');
      // Assign selections to specific lecturers and field pools
      const lecturerSelectionsWithIds = [
          { ...lecturerSelections[0], lecturerId: facultyMap.get('GV001'), fieldPoolId: aiPool?.id }, // Anh - AI
          { ...lecturerSelections[1], lecturerId: facultyMap.get('GV002'), fieldPoolId: sePool?.id }, // Bình - SE
          { ...lecturerSelections[2], lecturerId: facultyMap.get('GV005'), fieldPoolId: enginePool?.id }, // Em - Engine
          { ...lecturerSelections[3], lecturerId: facultyMap.get('GV007'), fieldPoolId: autoPool?.id }, // Hùng - Auto
          { ...lecturerSelections[4], lecturerId: facultyMap.get('GV009'), fieldPoolId: structPool?.id }, // Lâm - Struct
      ].filter(ls => ls.lecturerId && ls.fieldPoolId) // Filter out invalid ones
       .map(ls => ({
          ...ls,
          lecturerId: ls.lecturerId!, // Type assertion to satisfy Prisma's requirement
          fieldPoolId: ls.fieldPoolId! // Type assertion to satisfy Prisma's requirement
       }));

      await tx.lecturerSelection.createMany({ data: lecturerSelectionsWithIds });
      const seededLecturerSelections = await tx.lecturerSelection.findMany();
      console.log(`✅ Seeded ${seededLecturerSelections.length} lecturer selections.`);

  console.log('Seeding Student Selections...');
  const studentSelectionsData: Array<{
        id: string; priority: number; topicTitle?: string; status: StudentSelectionStatusT; studentId: string; lecturerId?: string; fieldPoolId?: string; preferredAt: Date; approvedById?: string; approvedByType?: UserT;
  }> = [];

      // Assign student selections more meaningfully
      const studentAn = seededStudents.find(s => s.studentCode === 'SVCNTT001');
      const studentBich = seededStudents.find(s => s.studentCode === 'SVCNTT002');
      const studentCanh = seededStudents.find(s => s.studentCode === 'SVCNTT003');
      const studentDieu = seededStudents.find(s => s.studentCode === 'SVCK001');
      const studentBien = seededStudents.find(s => s.studentCode === 'SVCK002');
      const studentHa = seededStudents.find(s => s.studentCode === 'SVDD001');
      const studentHung = seededStudents.find(s => s.studentCode === 'SVXD001');

      const lsAnh = seededLecturerSelections.find(ls => ls.lecturerId === facultyMap.get('GV001'));
      const lsBinh = seededLecturerSelections.find(ls => ls.lecturerId === facultyMap.get('GV002'));
      const lsEm = seededLecturerSelections.find(ls => ls.lecturerId === facultyMap.get('GV005'));
      const lsHungDien = seededLecturerSelections.find(ls => ls.lecturerId === facultyMap.get('GV007'));
      const lsLam = seededLecturerSelections.find(ls => ls.lecturerId === facultyMap.get('GV009'));

      if(studentAn && lsAnh) studentSelectionsData.push({ id: uuidv7(), priority: 1, status: StudentSelectionStatusT.APPROVED, studentId: studentAn.id, lecturerId: lsAnh.lecturerId ?? undefined, fieldPoolId: lsAnh.fieldPoolId ?? undefined, preferredAt: new Date(), approvedById: dean?.id ?? undefined, approvedByType: UserT.FACULTY, topicTitle: lsAnh.topicTitle ?? undefined });
      if(studentBich && lsBinh) studentSelectionsData.push({ id: uuidv7(), priority: 1, status: StudentSelectionStatusT.PENDING, studentId: studentBich.id, lecturerId: lsBinh.lecturerId ?? undefined, fieldPoolId: lsBinh.fieldPoolId ?? undefined, preferredAt: new Date(), topicTitle: lsBinh.topicTitle ?? undefined });
      if(studentCanh && lsAnh) studentSelectionsData.push({ id: uuidv7(), priority: 1, status: StudentSelectionStatusT.PENDING, studentId: studentCanh.id, lecturerId: lsAnh.lecturerId ?? undefined, fieldPoolId: lsAnh.fieldPoolId ?? undefined, preferredAt: new Date(), topicTitle: lsAnh.topicTitle ?? undefined });
      if(studentDieu && lsEm) studentSelectionsData.push({ id: uuidv7(), priority: 1, status: StudentSelectionStatusT.APPROVED, studentId: studentDieu.id, lecturerId: lsEm.lecturerId ?? undefined, fieldPoolId: lsEm.fieldPoolId ?? undefined, preferredAt: new Date(), approvedById: dean?.id ?? undefined, approvedByType: UserT.FACULTY, topicTitle: lsEm.topicTitle ?? undefined });
      if(studentBien && lsEm) studentSelectionsData.push({ id: uuidv7(), priority: 1, status: StudentSelectionStatusT.PENDING, studentId: studentBien.id, lecturerId: lsEm.lecturerId ?? undefined, fieldPoolId: lsEm.fieldPoolId ?? undefined, preferredAt: new Date(), topicTitle: lsEm.topicTitle ?? undefined });
      if(studentHa && lsHungDien) studentSelectionsData.push({ id: uuidv7(), priority: 1, status: StudentSelectionStatusT.PENDING, studentId: studentHa.id, lecturerId: lsHungDien.lecturerId ?? undefined, fieldPoolId: lsHungDien.fieldPoolId ?? undefined, preferredAt: new Date(), topicTitle: lsHungDien.topicTitle ?? undefined });
      if(studentHung && lsLam) studentSelectionsData.push({ id: uuidv7(), priority: 1, status: StudentSelectionStatusT.APPROVED, studentId: studentHung.id, lecturerId: lsLam.lecturerId ?? undefined, fieldPoolId: lsLam.fieldPoolId ?? undefined, preferredAt: new Date(), approvedById: dean?.id ?? undefined, approvedByType: UserT.FACULTY, topicTitle: lsLam.topicTitle ?? undefined });

  if (studentSelectionsData.length > 0) {
        await tx.studentSelection.createMany({ data: studentSelectionsData });
        console.log(`✅ Seeded ${studentSelectionsData.length} student selections.`);
  } else {
    console.log('⚠️ No student selections to seed.');
  }

  console.log('Seeding Project Allocations...');
  const projectAllocationsData: Array<{
        id: string; topicTitle: string; allocatedAt: Date; createdAt: Date; updatedAt: Date; studentId: string; createdById: string; lecturerId: string;
  }> = [];
      // Allocate projects for approved student selections
      const approvedSelections = studentSelectionsData.filter(ss => ss.status === StudentSelectionStatusT.APPROVED && ss.lecturerId);
      approvedSelections.forEach(sel => {
          if (dean && sel.studentId && sel.lecturerId && sel.topicTitle) {
    projectAllocationsData.push({
      id: uuidv7(),
                    topicTitle: sel.topicTitle,
      allocatedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
                    studentId: sel.studentId,
                    createdById: dean.id, // Dean allocated
                    lecturerId: sel.lecturerId,
                });
          }
      });

  if (projectAllocationsData.length > 0) {
        await tx.projectAllocation.createMany({ data: projectAllocationsData });
        console.log(`✅ Seeded ${projectAllocationsData.length} project allocations.`);
  } else {
    console.log('⚠️ No project allocations to seed.');
  }

  console.log('Seeding Evaluation Criteria...');
      if (criteriaCreator) {
        const evaluationCriteriaWithIds = evaluationCriteria.map(
          (criteria) => ({
    ...criteria,
    createdById: criteriaCreator.id,
          }),
        );
        await tx.evaluationCriteria.createMany({ data: evaluationCriteriaWithIds });
        const seededCriteria = await tx.evaluationCriteria.findMany();
  console.log(`✅ Seeded ${seededCriteria.length} evaluation criteria.`);
      } else {
        console.log('⚠️ Cannot find creator for evaluation criteria, skipping.');
      }

      // --- Notification Seeding Removed ---
      console.log('ℹ️ Notification seeding skipped.');

      console.log('✅ Seeding transaction completed successfully.');
    }); // Kết thúc transaction
  } catch (error) {
    console.error('🔴 Seeding transaction failed:', error);
    throw error;
  }

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('🔴 Seeding process failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });