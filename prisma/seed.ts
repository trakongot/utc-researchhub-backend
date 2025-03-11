import { faker } from '@faker-js/faker';
import {
  LecturerSelectionStatusT,
  PrismaClient,
  StudentSelectionStatusT,
  UserT,
} from '@prisma/client';
import { uuidv7 } from 'uuidv7';

const prisma = new PrismaClient();

async function seedStudents(count: number) {
  const emailSet = new Set<string>();

  const students = Array.from({ length: count }).map(() => {
    let email: string;
    do {
      email = faker.internet.email().toLowerCase();
    } while (emailSet.has(email));
    emailSet.add(email);

    return {
      id: uuidv7(),
      studentCode: faker.string.alphanumeric(8).toUpperCase(),
      fullName: faker.person.fullName().substring(0, 255),
      email: email.substring(0, 255),
      password: faker.internet.password().substring(0, 50),
      status: faker.helpers.arrayElement([
        'ACTIVE',
        'INACTIVE',
        'GRADUATED',
        'DROPPED_OUT',
        'ON_LEAVE',
      ]),
      profilePicture: faker.image.avatar().substring(0, 255),
      lastLogin: faker.date.recent(),
      isOnline: faker.datatype.boolean(),
    };
  });

  await prisma.student.createMany({ data: students });
  console.log(`✅ Successfully seeded ${count} students!`);
}

async function seedFaculties(count: number) {
  const faculties = Array.from({ length: count }).map(() => ({
    id: uuidv7(),
    facultyCode: faker.string.alphanumeric(8).toUpperCase(),
    fullName: faker.person.fullName().substring(0, 255),
    email: faker.internet.email().substring(0, 255),
    password: faker.internet.password().substring(0, 50),
    phoneNumber: faker.phone.number().substring(0, 9),
    rank: faker.helpers.arrayElement([
      'GS',
      'PGS',
      'TS',
      'ThS',
      'GVCC',
      'GVC',
      'GV',
      'TG',
    ]),
    status: faker.helpers.arrayElement([
      'ACTIVE',
      'INACTIVE',
      'RETIRED',
      'RESIGNED',
      'ON_LEAVE',
    ]),
    profilePicture: faker.image.avatar().substring(0, 255),
    lastLogin: faker.date.recent(),
    isOnline: faker.datatype.boolean(),
  }));

  await prisma.faculty.createMany({ data: faculties });
  console.log(`✅ Successfully seeded ${count} faculties!`);
}

async function seedDepartments(count: number) {
  const departments = Array.from({ length: count }).map(() => ({
    id: uuidv7(),
    departmentCode: faker.string.alphanumeric(5).toUpperCase(),
    name: faker.company.name().substring(0, 255),
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
  }));

  await prisma.department.createMany({ data: departments });
  console.log(`✅ Successfully seeded ${count} departments!`);
}

async function generateFieldPools() {
  const fieldPoolNames = [
    'Cầu đường',
    'Kỹ thuật Kết cấu',
    'Địa kỹ thuật',
    'Giao thông đô thị',
    'Quy hoạch Giao thông',
    'Vận tải và Logistics',
    'Công nghệ thông tin',
    'Hệ thống thông tin giao thông',
    'Cơ khí Giao thông',
    'Điện - Điện tử Giao thông',
    'Kinh tế Xây dựng',
    'Kinh tế Vận tải',
    'Tài chính - Ngân hàng',
    'Khoa học Môi trường',
    'Kỹ thuật Môi trường',
    'Quản lý Dự án',
    'An toàn Giao thông',
    'Kỹ thuật Ô tô',
    'Hệ thống đường sắt',
    'Hàng không và sân bay',
    'Hải cảng và Công trình biển',
    'Công trình thủy',
    'Kỹ thuật cầu thép',
    'Vật liệu Xây dựng',
    'Quản lý đô thị',
    'Giao thông thông minh',
    'Ứng dụng AI trong Giao thông',
    'Blockchain trong Logistics',
    'Thương mại điện tử và Giao thông',
    'Hạ tầng giao thông bền vững',
  ];

  const fieldPools = fieldPoolNames.map((name) => ({
    id: uuidv7(),
    name,
    description: `Chuyên ngành về ${name.toLowerCase()} tại UTC.`,
    status: faker.helpers.arrayElement(['OPEN', 'CLOSED', 'HIDDEN']),
    createdAt: new Date(),
    updatedAt: new Date(),
    registrationDeadline: faker.date.future(),
  }));

  await prisma.fieldPool.createMany({ data: fieldPools });
  console.log(`✅ Successfully seeded ${fieldPools.length} field pools!`);
}

async function generateDomains() {
  const domainNames = [
    'Artificial Intelligence',
    'Blockchain',
    'Circular Economy',
    'Cybersecurity',
    'Data Science',
    'E-Commerce',
    'Education Technology',
    'Environmental Science',
    'Financial Technology (Fintech)',
    'Health Informatics',
    'Internet of Things (IoT)',
    'Machine Learning',
    'Renewable Energy',
    'Robotics',
    'Smart Cities',
    'Software Engineering',
    'Sustainable Development',
    'Supply Chain Management',
    'UX/UI Design',
    'Virtual Reality & Augmented Reality',
  ];

  const domains = domainNames.map((name) => ({
    id: uuidv7(),
    name,
    description: `This domain focuses on ${name.toLowerCase()} and its applications.`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await prisma.domain.createMany({ data: domains });
  console.log(`✅ Successfully seeded ${domains.length} domains!`);
}

async function generateLecturerSelections(count: number) {
  const lecturers = await prisma.faculty.findMany({ select: { id: true } });
  const fieldPools = await prisma.fieldPool.findMany({ select: { id: true } });

  if (lecturers.length === 0 || fieldPools.length === 0) {
    console.warn(
      '⚠️ Không có dữ liệu Faculty hoặc FieldPool, bỏ qua tạo LecturerSelection.',
    );
    return;
  }

  const selections = Array.from({ length: count }).map(() => ({
    id: uuidv7(),
    priority: faker.number.int({ min: 1, max: 3 }),
    topicTitle: faker.lorem.words(5),
    description: faker.lorem.paragraph(),
    capacity: faker.number.int({ min: 1, max: 5 }),
    currentCapacity: faker.number.int({ min: 0, max: 5 }),
    status: faker.helpers.arrayElement(Object.values(LecturerSelectionStatusT)),
    isActive: true,
    lecturerId: faker.helpers.arrayElement(lecturers).id,
    fieldPoolId: faker.helpers.arrayElement(fieldPools).id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await prisma.lecturerSelection.createMany({ data: selections });
  console.log(`✅ Successfully seeded ${count} LecturerSelections!`);
}

async function generateStudentSelections(count: number) {
  const students = await prisma.student.findMany({ select: { id: true } });
  const lecturers = await prisma.faculty.findMany({ select: { id: true } });
  const fieldPools = await prisma.fieldPool.findMany({ select: { id: true } });

  if (!students.length || !lecturers.length || !fieldPools.length) {
    console.log('⚠️ Không đủ dữ liệu để tạo Student Selection.');
    return;
  }

  const selections = Array.from({ length: count }).map(() => ({
    id: uuidv7(),
    priority: faker.number.int({ min: 1, max: 3 }),
    topicTitle: faker.lorem.words(5),
    status: faker.helpers.arrayElement(Object.values(StudentSelectionStatusT)),
    createdAt: new Date(),
    updatedAt: new Date(),
    studentId: faker.helpers.arrayElement(students).id,
    lecturerId: faker.helpers.arrayElement(lecturers).id,
    fieldPoolId: faker.helpers.arrayElement(fieldPools).id,
    preferredAt: new Date(),
    approvedById: faker.helpers.arrayElement(lecturers).id,
    approvedByType: faker.helpers.arrayElement(Object.values(UserT)),
  }));

  await prisma.studentSelection.createMany({ data: selections });
  console.log(`✅ Successfully generated ${count} student selections!`);
}

async function generateProjectAllocations(count: number) {
  const students = await prisma.student.findMany({ select: { id: true } });
  const lecturers = await prisma.faculty.findMany({ select: { id: true } });

  if (!students.length || !lecturers.length) {
    console.log('⚠️ Không đủ dữ liệu để tạo Project Allocation.');
    return;
  }

  const allocations = Array.from({ length: count }).map(() => ({
    id: uuidv7(),
    topicTitle: faker.lorem.words(5),
    allocatedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    studentId: faker.helpers.arrayElement(students).id,
    createdById: faker.helpers.arrayElement(lecturers).id,
    lecturerId: faker.helpers.arrayElement(lecturers).id,
  }));

  await prisma.projectAllocation.createMany({ data: allocations });
  console.log(`✅ Successfully generated ${count} project allocations!`);
}

// Main function
async function main() {
  console.log('Seeding database...');

  // await seedStudents(2000);
  // await seedFaculties(100);
  // await seedDepartments(30);
  // await generateFieldPools();
  // await generateDomains();
  // await generateLecturerSelections(100);
  await generateStudentSelections(100);
  await generateProjectAllocations(10);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
