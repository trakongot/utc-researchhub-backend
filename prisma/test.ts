import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
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

async function generateFieldPoolDomains() {
  const fieldPools = await prisma.fieldPool.findMany({ select: { id: true } });
  const domains = await prisma.domain.findMany({ select: { id: true } });

  if (!fieldPools.length || !domains.length) {
    console.log('⚠️ Không đủ dữ liệu để tạo FieldPoolDomain.');
    return;
  }

  const fieldPoolDomains = fieldPools.flatMap((fieldPool) =>
    domains.map((domain) => ({
      fieldPoolId: fieldPool.id,
      domainId: domain.id,
    })),
  );

  await prisma.fieldPoolDomain.createMany({ data: fieldPoolDomains });
  console.log(
    `✅ Successfully seeded ${fieldPoolDomains.length} field pool domain links!`,
  );
}

async function generateFieldPoolDepartments() {
  const fieldPools = await prisma.fieldPool.findMany({ select: { id: true } });
  const departments = await prisma.department.findMany({
    select: { id: true },
  });

  if (!fieldPools.length || !departments.length) {
    console.log('⚠️ Không đủ dữ liệu để tạo FieldPoolDepartment.');
    return;
  }

  const fieldPoolDepartments = fieldPools.flatMap((fieldPool) =>
    departments.map((department) => ({
      fieldPoolId: fieldPool.id,
      departmentId: department.id,
    })),
  );

  await prisma.fieldPoolDepartment.createMany({ data: fieldPoolDepartments });
  console.log(
    `✅ Successfully seeded ${fieldPoolDepartments.length} field pool department links!`,
  );
}

async function main() {
  console.log('Seeding database...');

  await generateFieldPools();
  await generateDomains();
  await seedDepartments(30);

  await generateFieldPoolDomains();
  await generateFieldPoolDepartments();

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
