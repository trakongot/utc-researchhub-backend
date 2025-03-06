import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { uuidv7 } from 'uuidv7';

const prisma = new PrismaClient();

// Seed Students
async function seedStudents(count: number) {
  for (let i = 0; i < count; i++) {
    await prisma.student.create({
      data: {
        id: uuidv7(),
        studentCode: faker.string.alphanumeric(8).toUpperCase(),
        fullName: faker.person.fullName().substring(0, 255),
        email: faker.internet.email().substring(0, 255),
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
      },
    });
  }
}

// Seed Faculty
async function seedFaculties(count: number) {
  for (let i = 0; i < count; i++) {
    await prisma.faculty.create({
      data: {
        id: uuidv7(),
        facultyCode: faker.string.alphanumeric(8).toUpperCase(),
        fullName: faker.person.fullName().substring(0, 255),
        email: faker.internet.email().substring(0, 255),
        password: faker.internet.password().substring(0, 50),
        phoneNumber: faker.phone.number().substring(0, 9),
        rank: faker.helpers.arrayElement([
          'GS', // Giáo sư (Professor)
          'PGS', // Phó Giáo sư (Associate Professor)
          'TS', // Tiến sĩ (Doctor)
          'ThS', // Thạc sĩ (Master)
          'GVCC', // Giảng viên cao cấp (Senior Lecturer)
          'GVC', // Giảng viên chính (Lecturer)
          'GV', // Giảng viên (Instructor)
          'TG', // Trợ giảng (Teaching Assistant)
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
      },
    });
  }
}

// Seed Departments
async function seedDepartments(count: number) {
  for (let i = 0; i < count; i++) {
    await prisma.department.create({
      data: {
        id: uuidv7(),
        departmentCode: faker.string.alphanumeric(5).toUpperCase(),
        name: faker.company.name().substring(0, 255),
        description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
      },
    });
  }
}

// Seed Tags
async function seedTags() {
  const tags = [
    'AI',
    'Machine Learning',
    'Blockchain',
    'Web Development',
    'Mobile App',
    'Y tế',
    'Logistics',
    'Kinh tế',
    'Xây dựng',
    'Hàng hải',
  ];

  for (const tagName of tags) {
    await prisma.tag.create({
      data: {
        id: uuidv7(),
        name: tagName,
        description: faker.book.title(),
      },
    });
  }
}

// Seed FieldPools
async function seedFieldPools() {
  const fieldPools = [
    {
      name: 'Trí tuệ nhân tạo (AI)',
      description:
        'Nghiên cứu và phát triển thuật toán AI, học sâu, xử lý ngôn ngữ tự nhiên và thị giác máy tính.',
    },
    {
      name: 'Học máy (Machine Learning)',
      description:
        'Ứng dụng và tối ưu hóa thuật toán học máy trong nhiều lĩnh vực như tài chính, y tế, công nghiệp.',
    },
    {
      name: 'Blockchain',
      description:
        'Phát triển hệ thống phi tập trung, hợp đồng thông minh, bảo mật và ứng dụng blockchain trong nhiều lĩnh vực.',
    },
    {
      name: 'An toàn và bảo mật thông tin',
      description:
        'Nghiên cứu các mô hình bảo mật, mã hóa dữ liệu, phòng chống tấn công mạng và bảo vệ hệ thống thông tin.',
    },
    {
      name: 'Phát triển Web',
      description:
        'Nghiên cứu công nghệ frontend, backend, fullstack, tối ưu hiệu suất và bảo mật web.',
    },
    {
      name: 'Phát triển Ứng dụng Di động',
      description:
        'Thiết kế và xây dựng ứng dụng trên iOS, Android, phát triển ứng dụng đa nền tảng.',
    },
    {
      name: 'Internet vạn vật (IoT)',
      description:
        'Phát triển hệ thống IoT, cảm biến thông minh, ứng dụng IoT trong công nghiệp, nông nghiệp và đời sống.',
    },
    {
      name: 'Điện toán đám mây',
      description:
        'Nghiên cứu các mô hình điện toán đám mây, tối ưu hóa lưu trữ, xử lý dữ liệu lớn trên cloud.',
    },
    {
      name: 'Thực tế ảo (VR) và Thực tế tăng cường (AR)',
      description:
        'Phát triển công nghệ VR/AR ứng dụng trong giải trí, y tế, giáo dục và thương mại điện tử.',
    },
    {
      name: 'Robot và Tự động hóa',
      description:
        'Phát triển robot công nghiệp, robot dịch vụ, tự động hóa dây chuyền sản xuất và hệ thống điều khiển thông minh.',
    },
    {
      name: 'Hệ thống nhúng',
      description:
        'Thiết kế vi điều khiển, lập trình firmware, tối ưu hệ thống nhúng cho các thiết bị thông minh.',
    },
    {
      name: 'Giao thông thông minh',
      description:
        'Phát triển hệ thống giao thông thông minh, xe tự hành, tối ưu hóa giao thông đô thị.',
    },
    {
      name: 'Hệ thống logistics',
      description:
        'Nghiên cứu tối ưu hóa chuỗi cung ứng, quản lý kho vận bằng công nghệ thông minh.',
    },
    {
      name: 'Công nghệ vật liệu mới',
      description:
        'Phát triển vật liệu tiên tiến, công nghệ nano, ứng dụng trong y sinh, xây dựng và năng lượng.',
    },
    {
      name: 'Năng lượng tái tạo',
      description:
        'Nghiên cứu công nghệ năng lượng mặt trời, gió, hydro, lưu trữ năng lượng và tối ưu hóa hiệu suất.',
    },
    {
      name: 'Công nghệ môi trường',
      description:
        'Nghiên cứu xử lý nước thải, khí thải, tái chế chất thải và công nghệ bảo vệ môi trường.',
    },
    {
      name: 'Công nghệ y tế',
      description:
        'Ứng dụng AI, IoT, dữ liệu lớn trong y tế, phát triển thiết bị chẩn đoán thông minh và y học chính xác.',
    },
    {
      name: 'Hệ thống thông tin địa lý (GIS)',
      description:
        'Ứng dụng GIS trong quản lý đô thị, quy hoạch tài nguyên thiên nhiên và theo dõi biến đổi khí hậu.',
    },
    {
      name: 'Khoa học dữ liệu',
      description:
        'Phân tích dữ liệu lớn, khai thác dữ liệu, xây dựng mô hình dự báo cho các lĩnh vực tài chính, marketing, y tế.',
    },
    {
      name: 'Thương mại điện tử',
      description:
        'Phát triển nền tảng bán hàng trực tuyến, tối ưu hóa trải nghiệm người dùng, ứng dụng AI trong cá nhân hóa sản phẩm.',
    },
    {
      name: 'Viễn thông và Mạng 5G',
      description:
        'Nghiên cứu công nghệ 5G, truyền dữ liệu tốc độ cao, bảo mật mạng viễn thông.',
    },
    {
      name: 'Hàng không và Không gian',
      description:
        'Nghiên cứu công nghệ hàng không, vệ tinh, khám phá không gian và truyền thông vũ trụ.',
    },
  ];

  const departments = await prisma.department.findMany();
  const tags = await prisma.tag.findMany();

  if (departments.length === 0 || tags.length === 0) return;

  for (const field of fieldPools) {
    const fieldPool = await prisma.fieldPool.create({
      data: {
        id: uuidv7(),
        name: field.name,
        description: field.description,
      },
    });

    // Liên kết FieldPool với Department
    const randomDepartments = faker.helpers.arrayElements(departments, {
      min: 1,
      max: 3,
    });
    for (const dept of randomDepartments) {
      await prisma.fieldPoolDepartment.create({
        data: {
          fieldPoolId: fieldPool.id,
          departmentId: dept.id,
        },
      });
    }

    // Liên kết FieldPool với Tag
    const randomTags = faker.helpers.arrayElements(tags, { min: 1, max: 3 });
    for (const tag of randomTags) {
      await prisma.fieldPoolTag.create({
        data: {
          fieldPoolId: fieldPool.id,
          tagId: tag.id,
        },
      });
    }
  }
}
// Seed LecturerSelections
async function seedLecturerSelections(count: number) {
  const faculties = await prisma.faculty.findMany();
  const fieldPools = await prisma.fieldPool.findMany();
  const tags = await prisma.tag.findMany();

  if (faculties.length === 0 || fieldPools.length === 0 || tags.length === 0)
    return;

  for (let i = 0; i < count; i++) {
    const lecturerSelection = await prisma.lecturerSelection.create({
      data: {
        id: uuidv7(),
        priority: faker.number.int({ min: 1, max: 5 }),
        topicTitle: faker.lorem.words(5).substring(0, 255),
        description: faker.lorem.sentence(),
        capacity: faker.number.int({ min: 1, max: 5 }),
        isActive: faker.datatype.boolean(),
        lecturerId: faker.helpers.arrayElement(faculties).id,
        fieldPoolId: faker.helpers.arrayElement(fieldPools).id,
      },
    });

    // Liên kết LecturerSelection với Tag (LecturerSelectionTag)
    const randomTags = faker.helpers.arrayElements(tags, { min: 1, max: 3 });
    for (const tag of randomTags) {
      await prisma.lecturerSelectionTag.create({
        data: {
          lecturerSelectionId: lecturerSelection.id,
          tagId: tag.id,
        },
      });
    }
  }
}

// Seed StudentSelections
async function seedStudentSelections(count: number) {
  const students = await prisma.student.findMany();
  const faculties = await prisma.faculty.findMany();
  const fieldPools = await prisma.fieldPool.findMany();
  const tags = await prisma.tag.findMany();

  if (
    students.length === 0 ||
    faculties.length === 0 ||
    fieldPools.length === 0 ||
    tags.length === 0
  )
    return;

  for (let i = 0; i < count; i++) {
    const studentSelection = await prisma.studentSelection.create({
      data: {
        id: uuidv7(),
        priority: faker.number.int({ min: 1, max: 3 }),
        preferredAt: faker.date.recent(),
        status: faker.helpers.arrayElement(['PENDING', 'APPROVED', 'REJECTED']),
        studentId: faker.helpers.arrayElement(students).id,
        facultyMemberId: faker.helpers.arrayElement(faculties).id,
        fieldPoolId: faker.helpers.arrayElement(fieldPools).id,
      },
    });

    // Liên kết StudentSelection với Tag (StudentSelectionTag)
    const randomTags = faker.helpers.arrayElements(tags, { min: 1, max: 3 });
    for (const tag of randomTags) {
      await prisma.studentSelectionTag.create({
        data: {
          studentSelectionId: studentSelection.id,
          tagId: tag.id,
        },
      });
    }
  }
}

// Seed ProjectAllocations
async function seedProjectAllocations(count: number) {
  const students = await prisma.student.findMany();
  const faculties = await prisma.faculty.findMany();

  if (students.length === 0 || faculties.length === 0) return;

  for (let i = 0; i < count; i++) {
    await prisma.projectAllocation.create({
      data: {
        id: uuidv7(),
        topicTitle: faker.lorem.words(5).substring(0, 255),
        allocatedAt: faker.date.past(),
        studentId: faker.helpers.arrayElement(students).id,
        lecturerId: faker.helpers.arrayElement(faculties).id,
        createdById: faker.helpers.arrayElement(faculties).id,
      },
    });
  }
}

// Main function
async function main() {
  console.log('Seeding database...');

  await seedStudents(400);
  await seedFaculties(30);
  await seedDepartments(5);
  await seedTags();
  await seedFieldPools();
  await seedLecturerSelections(20);
  await seedStudentSelections(20);
  await seedProjectAllocations(15);

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
