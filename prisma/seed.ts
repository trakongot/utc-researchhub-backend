// prisma/seed.ts
import {
  DepartmentStatusT,
  FacultyRoleT,
  FacultyStatusT,
  FieldPoolStatusT,
  GenderT,
  LecturerSelectionStatusT,
  Prisma,
  PrismaClient,
  ProposedProjectStatusT,
  StudentSelectionStatusT,
  StudentStatusT,
} from '@prisma/client';
import { uuidv7 } from 'uuidv7';

const prisma = new PrismaClient();

const departments = [
  {
    id: uuidv7(),
    departmentCode: 'IT',
    name: 'Information Technology',
    description: 'Faculty of Information Technology UTC',
    status: DepartmentStatusT.ACTIVE,
  },
  {
    id: uuidv7(),
    departmentCode: 'MECH',
    name: 'Mechanical Engineering',
    description: 'Faculty of Mechanical Engineering UTC',
    status: DepartmentStatusT.ACTIVE,
  },
  {
    id: uuidv7(),
    departmentCode: 'EEE',
    name: 'Electrical & Electronic Engineering',
    description: 'Faculty of Electrical & Electronic Engineering UTC',
    status: DepartmentStatusT.ACTIVE,
  },
  {
    id: uuidv7(),
    departmentCode: 'CIVIL',
    name: 'Civil Engineering',
    description: 'Faculty of Civil Engineering UTC',
    status: DepartmentStatusT.ACTIVE,
  },
  {
    id: uuidv7(),
    departmentCode: 'ECON',
    name: 'Economics',
    description: 'Faculty of Economics and Business UTC',
    status: DepartmentStatusT.ACTIVE,
  },
  {
    id: uuidv7(),
    departmentCode: 'TRANS',
    name: 'Transportation',
    description: 'Faculty of Transportation and Logistics UTC',
    status: DepartmentStatusT.ACTIVE,
  },
];

const faculties = [
  // IT Department
  {
    id: uuidv7(),
    facultyCode: 'F001',
    fullName: 'Nguyen Van Anh (Dean)',
    email: 'nvanh@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'PhD',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Dean of IT Faculty, AI specialist.',
    phoneNumber: '0987654321',
  },
  {
    id: uuidv7(),
    facultyCode: 'F002',
    fullName: 'Tran Thi Binh (Head)',
    email: 'ttbinh@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'Assoc. Prof.',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Head of CS Department, SE specialist.',
    phoneNumber: '0987654322',
  },
  {
    id: uuidv7(),
    facultyCode: 'F003',
    fullName: 'Le Minh Cuong (Advisor)',
    email: 'lmcuong@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'MSc',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'CS Lecturer, academic advisor.',
    phoneNumber: '0987654323',
  },
  {
    id: uuidv7(),
    facultyCode: 'F004',
    fullName: 'Pham Thi Dung (Secretary)',
    email: 'ptdung@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'MSc',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'IT Faculty Secretary.',
    phoneNumber: '0987654324',
  },
  {
    id: uuidv7(),
    facultyCode: 'F011',
    fullName: 'Nguyen Thanh Tung',
    email: 'nttung@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'PhD',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Expert in Cybersecurity',
    phoneNumber: '0987654330',
  },
  {
    id: uuidv7(),
    facultyCode: 'F012',
    fullName: 'Le Van Nam',
    email: 'lvnam@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'PhD',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Web application development expert',
    phoneNumber: '0987654331',
  },

  // Mechanical Engineering Department
  {
    id: uuidv7(),
    facultyCode: 'F005',
    fullName: 'Hoang Van Em (Head)',
    email: 'hvem@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'PhD',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Head of Automotive Engineering Dept.',
    phoneNumber: '0987654325',
  },
  {
    id: uuidv7(),
    facultyCode: 'F006',
    fullName: 'Vu Thi Giang',
    email: 'vtgiang@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'MSc',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Machine Manufacturing Lecturer.',
    phoneNumber: '0987654326',
  },
  {
    id: uuidv7(),
    facultyCode: 'F013',
    fullName: 'Tran Duc Hoa',
    email: 'tdhoa@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'PhD',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Expert in Thermodynamics',
    phoneNumber: '0987654332',
  },

  // Electrical Engineering Department
  {
    id: uuidv7(),
    facultyCode: 'F007',
    fullName: 'Do Van Hung (Head)',
    email: 'dvhung@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'Assoc. Prof. PhD',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Head of Automation Dept.',
    phoneNumber: '0987654327',
  },
  {
    id: uuidv7(),
    facultyCode: 'F008',
    fullName: 'Nguyen Thi Kieu',
    email: 'ntkieu@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'PhD',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Electrical Systems Lecturer.',
    phoneNumber: '0987654328',
  },
  {
    id: uuidv7(),
    facultyCode: 'F014',
    fullName: 'Bui Quang Minh',
    email: 'bqminh@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'PhD',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Expert in Power Electronics',
    phoneNumber: '0987654333',
  },

  // Civil Engineering Department
  {
    id: uuidv7(),
    facultyCode: 'F009',
    fullName: 'Le Van Lam (Head)',
    email: 'lvlam@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'PhD',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Head of Bridge and Tunnel Dept.',
    phoneNumber: '0987654329',
  },
  {
    id: uuidv7(),
    facultyCode: 'F010',
    fullName: 'Mai Thi Ngoc',
    email: 'mtngoc@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'MSc',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Structural Engineering Lecturer.',
    phoneNumber: '0987654330',
  },
  {
    id: uuidv7(),
    facultyCode: 'F015',
    fullName: 'Dang Tan Phat',
    email: 'dtphat@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'PhD',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Expert in Construction Materials',
    phoneNumber: '0987654334',
  },

  // Economics Department
  {
    id: uuidv7(),
    facultyCode: 'F016',
    fullName: 'Trinh Van Hoang (Head)',
    email: 'tvhoang@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'PhD',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Head of Economics Department',
    phoneNumber: '0987654335',
  },
  {
    id: uuidv7(),
    facultyCode: 'F017',
    fullName: 'Nguyen Thi Mai Huong',
    email: 'ntmhuong@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'PhD',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Business Finance Expert',
    phoneNumber: '0987654336',
  },

  // Transportation Department
  {
    id: uuidv7(),
    facultyCode: 'F018',
    fullName: 'Duong Hong Son (Head)',
    email: 'dhson@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'PhD',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Head of Transportation Department',
    phoneNumber: '0987654337',
  },
  {
    id: uuidv7(),
    facultyCode: 'F019',
    fullName: 'Pham Thu Thao',
    email: 'ptthao@utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    rank: 'PhD',
    status: FacultyStatusT.ACTIVE,
    departmentId: null,
    bio: 'Logistics and Supply Chain Expert',
    phoneNumber: '0987654338',
  },
];

const students = [
  // IT students
  {
    id: uuidv7(),
    studentCode: 'SIT001',
    fullName: 'Nguyen Van An',
    email: 'an.nguyenvan@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2021,
    currentGpa: 3.5,
    gender: GenderT.MALE,
    dateOfBirth: new Date('2003-05-10'),
    phone: '0912345678',
  },
  {
    id: uuidv7(),
    studentCode: 'SIT002',
    fullName: 'Tran Thi Bich',
    email: 'bich.tranthi@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2021,
    currentGpa: 3.7,
    gender: GenderT.FEMALE,
    dateOfBirth: new Date('2003-07-15'),
    phone: '0912345679',
  },
  {
    id: uuidv7(),
    studentCode: 'SIT003',
    fullName: 'Le Van Canh',
    email: 'canh.levan@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2022,
    currentGpa: 3.2,
    gender: GenderT.MALE,
    dateOfBirth: new Date('2004-01-20'),
    phone: '0912345680',
  },
  {
    id: uuidv7(),
    studentCode: 'SIT004',
    fullName: 'Pham Minh Duc',
    email: 'duc.phamminh@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2021,
    currentGpa: 3.2,
    gender: GenderT.MALE,
    dateOfBirth: new Date('2003-04-12'),
    phone: '0912345681',
  },
  {
    id: uuidv7(),
    studentCode: 'SIT005',
    fullName: 'Vo Hoang Yen',
    email: 'yen.vohoang@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2021,
    currentGpa: 3.9,
    gender: GenderT.FEMALE,
    dateOfBirth: new Date('2003-09-30'),
    phone: '0912345682',
  },
  {
    id: uuidv7(),
    studentCode: 'SIT006',
    fullName: 'Dinh Quoc Bao',
    email: 'bao.dinhquoc@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2022,
    currentGpa: 3.4,
    gender: GenderT.MALE,
    dateOfBirth: new Date('2004-02-18'),
    phone: '0912345683',
  },

  // Mechanical Engineering students
  {
    id: uuidv7(),
    studentCode: 'SMECH001',
    fullName: 'Pham Thi Dieu',
    email: 'dieu.phamthi@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2021,
    currentGpa: 3.1,
    gender: GenderT.FEMALE,
    dateOfBirth: new Date('2003-09-01'),
    phone: '0912345684',
  },
  {
    id: uuidv7(),
    studentCode: 'SMECH002',
    fullName: 'Hoang Van Bien',
    email: 'bien.hoangvan@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2022,
    currentGpa: 3.0,
    gender: GenderT.MALE,
    dateOfBirth: new Date('2004-03-12'),
    phone: '0912345685',
  },
  {
    id: uuidv7(),
    studentCode: 'SMECH003',
    fullName: 'Le Thanh Tung',
    email: 'tung.lethanh@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2021,
    currentGpa: 3.4,
    gender: GenderT.MALE,
    dateOfBirth: new Date('2003-06-20'),
    phone: '0912345686',
  },
  {
    id: uuidv7(),
    studentCode: 'SMECH004',
    fullName: 'Tran Van Quyet',
    email: 'quyet.tranvan@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2022,
    currentGpa: 3.2,
    gender: GenderT.MALE,
    dateOfBirth: new Date('2004-02-15'),
    phone: '0912345687',
  },

  // Electrical Engineering students
  {
    id: uuidv7(),
    studentCode: 'SEEE001',
    fullName: 'Vu Thi Ha',
    email: 'ha.vuthi@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2021,
    currentGpa: 3.6,
    gender: GenderT.FEMALE,
    dateOfBirth: new Date('2003-11-25'),
    phone: '0912345688',
  },
  {
    id: uuidv7(),
    studentCode: 'SEEE002',
    fullName: 'Duong Quoc Duy',
    email: 'duy.duongquoc@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2021,
    currentGpa: 3.5,
    gender: GenderT.MALE,
    dateOfBirth: new Date('2003-07-14'),
    phone: '0912345689',
  },
  {
    id: uuidv7(),
    studentCode: 'SEEE003',
    fullName: 'Ngo Manh Hung',
    email: 'hung.ngomanh@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2022,
    currentGpa: 3.4,
    gender: GenderT.MALE,
    dateOfBirth: new Date('2004-05-18'),
    phone: '0912345690',
  },

  // Civil Engineering students
  {
    id: uuidv7(),
    studentCode: 'SCIVIL001',
    fullName: 'Do Van Hung',
    email: 'hung.dovan@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2022,
    currentGpa: 3.3,
    gender: GenderT.MALE,
    dateOfBirth: new Date('2004-08-08'),
    phone: '0912345691',
  },
  {
    id: uuidv7(),
    studentCode: 'SCIVIL002',
    fullName: 'Truong Thi Thanh',
    email: 'thanh.truongthi@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2021,
    currentGpa: 3.7,
    gender: GenderT.FEMALE,
    dateOfBirth: new Date('2003-03-22'),
    phone: '0912345692',
  },
  {
    id: uuidv7(),
    studentCode: 'SCIVIL003',
    fullName: 'Le Minh Quan',
    email: 'quan.leminh@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2022,
    currentGpa: 3.1,
    gender: GenderT.MALE,
    dateOfBirth: new Date('2004-09-15'),
    phone: '0912345693',
  },

  // Economics students
  {
    id: uuidv7(),
    studentCode: 'SECON001',
    fullName: 'Hoang Thi Linh',
    email: 'linh.hoangthi@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2021,
    currentGpa: 3.8,
    gender: GenderT.FEMALE,
    dateOfBirth: new Date('2003-10-12'),
    phone: '0912345694',
  },
  {
    id: uuidv7(),
    studentCode: 'SECON002',
    fullName: 'Dao Quang Tuan',
    email: 'tuan.daoquang@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2022,
    currentGpa: 3.5,
    gender: GenderT.MALE,
    dateOfBirth: new Date('2004-11-05'),
    phone: '0912345695',
  },

  // Transportation students
  {
    id: uuidv7(),
    studentCode: 'STRANS001',
    fullName: 'Trinh Thi Hanh',
    email: 'hanh.trinhthi@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2021,
    currentGpa: 3.6,
    gender: GenderT.FEMALE,
    dateOfBirth: new Date('2003-12-25'),
    phone: '0912345696',
  },
  {
    id: uuidv7(),
    studentCode: 'STRANS002',
    fullName: 'Ly Van Manh',
    email: 'manh.lyvan@st.utc.edu.vn',
    password: '$2b$10$4BR920xd4IHuTSaWykT79u.PIziUOBYo4A06vvH37Oe6/6Ju2x9fm',
    status: StudentStatusT.ACTIVE,
    departmentId: null,
    admissionYear: 2022,
    currentGpa: 3.3,
    gender: GenderT.MALE,
    dateOfBirth: new Date('2004-07-19'),
    phone: '0912345697',
  },
];

const fieldPools = [
  {
    id: uuidv7(),
    name: 'Artificial Intelligence (AI)',
    description: 'Research and application of AI.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2025-06-30'),
  },
  {
    id: uuidv7(),
    name: 'Software Engineering',
    description: 'Software development and processes.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2025-06-30'),
  },
  {
    id: uuidv7(),
    name: 'Automotive Engineering',
    description: 'Research on engines and powertrain systems.',
    status: FieldPoolStatusT.CLOSED,
  },
  {
    id: uuidv7(),
    name: 'Automation',
    description: 'Design and control of automated systems.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2025-06-30'),
  },
  {
    id: uuidv7(),
    name: 'Structural Engineering',
    description: 'Analysis and design of structures.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2025-06-30'),
  },
  {
    id: uuidv7(),
    name: 'Data Science',
    description: 'Big data analytics and data-driven decision making.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2025-06-30'),
  },
  {
    id: uuidv7(),
    name: 'Computer Networks',
    description: 'Design and security of computer networks.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2025-06-30'),
  },
  {
    id: uuidv7(),
    name: 'Embedded Systems',
    description: 'Design and implementation of embedded systems.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2025-06-30'),
  },
  {
    id: uuidv7(),
    name: 'Transportation Planning',
    description: 'Urban transportation systems and logistics.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2025-06-30'),
  },
  {
    id: uuidv7(),
    name: 'Economics and Finance',
    description: 'Economic analysis and financial systems.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2025-06-30'),
  },
  {
    id: uuidv7(),
    name: 'Material Science',
    description: 'Research and development of new materials.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2025-06-30'),
  },
  {
    id: uuidv7(),
    name: 'Renewable Energy',
    description: 'Sustainable energy sources and efficiency.',
    status: FieldPoolStatusT.OPEN,
    registrationDeadline: new Date('2025-06-30'),
  },
];

const domains = [
  { id: uuidv7(), name: 'Machine Learning', description: 'Machine Learning' },
  { id: uuidv7(), name: 'Deep Learning', description: 'Deep Learning' },
  {
    id: uuidv7(),
    name: 'Software Engineering',
    description: 'Software Engineering',
  },
  { id: uuidv7(), name: 'Engine Design', description: 'Engine Design' },
  { id: uuidv7(), name: 'Control Systems', description: 'Control Systems' },
  {
    id: uuidv7(),
    name: 'Structural Analysis',
    description: 'Structural Analysis',
  },
  { id: uuidv7(), name: 'Big Data', description: 'Big Data Analytics' },
  { id: uuidv7(), name: 'Cybersecurity', description: 'Network Security' },
  { id: uuidv7(), name: 'Web Development', description: 'Web Applications' },
  { id: uuidv7(), name: 'Mobile Development', description: 'Mobile Apps' },
  { id: uuidv7(), name: 'IoT', description: 'Internet of Things' },
  { id: uuidv7(), name: 'Cloud Computing', description: 'Cloud Systems' },
  { id: uuidv7(), name: 'Robotics', description: 'Robotics Systems' },
  { id: uuidv7(), name: 'Computer Vision', description: 'Image Processing' },
  { id: uuidv7(), name: 'Natural Language Processing', description: 'NLP' },
  { id: uuidv7(), name: 'Database Systems', description: 'Database Design' },
  { id: uuidv7(), name: 'Financial Analysis', description: 'Economic Models' },
  { id: uuidv7(), name: 'Logistics', description: 'Supply Chain' },
  {
    id: uuidv7(),
    name: 'Material Testing',
    description: 'Material Properties',
  },
  { id: uuidv7(), name: 'Solar Energy', description: 'Photovoltaic Systems' },
];

const lecturerSelections = [
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Applying Deep Learning in Medical Image Recognition',
    description: 'Research CNN models for diagnosis.',
    capacity: 2,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Building a DevOps Pipeline for Microservices Applications',
    description: 'Integrate CI/CD, monitoring.',
    capacity: 3,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Simulation of Electronic Fuel Injection Systems',
    description: 'Using simulation software.',
    capacity: 2,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Designing a PID Controller for a Robotic Arm',
    description: 'Control position and speed.',
    capacity: 3,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Structural Analysis of Cable-Stayed Bridges using FEM',
    description: 'Using SAP2000 or Midas Civil.',
    capacity: 2,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Natural Language Processing for Sentiment Analysis',
    description: 'Analyzing social media sentiment using NLP models.',
    capacity: 2,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Blockchain Applications in Supply Chain Management',
    description:
      'Implementing distributed ledgers for supply chain traceability.',
    capacity: 2,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Smart Home Automation System Design',
    description: 'Developing IoT-based home automation solutions.',
    capacity: 3,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Reinforcement Learning for Autonomous Vehicles',
    description: 'AI models for self-driving car decision making.',
    capacity: 2,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Urban Traffic Flow Optimization',
    description: 'Modeling and optimization of urban transportation networks.',
    capacity: 3,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Economic Impact of E-commerce on Traditional Retail',
    description: 'Analysis of market disruption by online commerce.',
    capacity: 2,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Renewable Energy Integration in Power Grids',
    description: 'Challenges and solutions for renewable energy sources.',
    capacity: 2,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Advanced Materials for Construction',
    description: 'Development and testing of new building materials.',
    capacity: 3,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Network Security Threat Detection',
    description: 'Identifying and mitigating network intrusions.',
    capacity: 2,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
  {
    id: uuidv7(),
    priority: 1,
    topicTitle: 'Precision Agriculture using Drones',
    description: 'Drone-based crop monitoring and analysis.',
    capacity: 2,
    status: LecturerSelectionStatusT.APPROVED,
    isActive: true,
  },
];

const evaluationCriteria = [
  {
    id: uuidv7(),
    name: 'Novelty and Creativity',
    description: 'Degree of novelty and uniqueness of the topic.',
    weight: 0.15,
    isDefault: true,
    version: 1,
  },
  {
    id: uuidv7(),
    name: 'Theoretical Basis',
    description: 'Level of understanding and application of theory.',
    weight: 0.2,
    isDefault: true,
    version: 1,
  },
  {
    id: uuidv7(),
    name: 'Research Methodology',
    description: 'Rationality and scientific rigor of the method.',
    weight: 0.25,
    isDefault: true,
    version: 1,
  },
  {
    id: uuidv7(),
    name: 'Results Achieved',
    description: 'Degree of completion of objectives, product.',
    weight: 0.25,
    isDefault: true,
    version: 1,
  },
  {
    id: uuidv7(),
    name: 'Presentation Format',
    description: 'Presentation of the report, slides.',
    weight: 0.15,
    isDefault: true,
    version: 1,
  },
];

async function main() {
  console.log('Starting database seeding...');

  console.log('Clearing existing data (order respects constraints)...');
  await prisma.$transaction([
    prisma.notification.deleteMany({}),
    prisma.auditLog.deleteMany({}),
    prisma.fieldPoolDomain.deleteMany({}),
    prisma.fieldPoolDepartment.deleteMany({}),
    prisma.projectCriteriaScore.deleteMany({}),
    prisma.reportAttachment.deleteMany({}),
    prisma.projectReportComment.deleteMany({}),
    prisma.defenseMember.deleteMany({}),
    prisma.projectDomain.deleteMany({}),
    prisma.projectComment.deleteMany({}),
    prisma.projectMember.deleteMany({}),
    prisma.proposedProjectComment.deleteMany({}),
    prisma.proposedProjectMember.deleteMany({}),
    prisma.proposedProject.deleteMany({}),
    prisma.projectAllocation.deleteMany({}),
    prisma.studentSelection.deleteMany({}),
    prisma.lecturerSelection.deleteMany({}),
    prisma.facultyRole.deleteMany({}),
    prisma.evaluationCriteria.deleteMany({}),
    prisma.projectEvaluation.deleteMany({}),
    prisma.defenseCommittee.deleteMany({}),
    prisma.projectFinalReport.deleteMany({}),
    prisma.file.deleteMany({}),
    prisma.proposalOutline.deleteMany({}),
    prisma.project.deleteMany({}),
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
      const deptMap = new Map(
        seededDepartments.map((d) => [d.departmentCode, d.id]),
      );
      console.log(`✅ Seeded ${seededDepartments.length} departments.`);

      console.log('Seeding Faculty...');
      const facultiesWithDepts = faculties.map((faculty, index) => {
        let deptId: string | null = null;
        if (index < 6) deptId = deptMap.get('IT') || null;
        else if (index < 9) deptId = deptMap.get('MECH') || null;
        else if (index < 12) deptId = deptMap.get('EEE') || null;
        else if (index < 15) deptId = deptMap.get('CIVIL') || null;
        else if (index < 17) deptId = deptMap.get('ECON') || null;
        else deptId = deptMap.get('TRANS') || null;
        return { ...faculty, departmentId: deptId };
      });
      await tx.faculty.createMany({ data: facultiesWithDepts });
      const seededFaculty = await tx.faculty.findMany();
      console.log(`✅ Seeded ${seededFaculty.length} faculty members.`);

      console.log('Seeding Students...');
      const studentsWithDepts = students.map((student) => {
        let deptId: string | null = null;
        if (student.studentCode.startsWith('SIT'))
          deptId = deptMap.get('IT') || null;
        else if (student.studentCode.startsWith('SMECH'))
          deptId = deptMap.get('MECH') || null;
        else if (student.studentCode.startsWith('SEEE'))
          deptId = deptMap.get('EEE') || null;
        else if (student.studentCode.startsWith('SCIVIL'))
          deptId = deptMap.get('CIVIL') || null;
        else if (student.studentCode.startsWith('SECON'))
          deptId = deptMap.get('ECON') || null;
        else if (student.studentCode.startsWith('STRANS'))
          deptId = deptMap.get('TRANS') || null;
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

      const dean = seededFaculty.find((f) => f.facultyCode === 'F001');
      const criteriaCreator = dean || seededFaculty[0];

      console.log('Seeding Faculty Roles...');
      const facultyRolesData: Array<{
        id: string;
        facultyId: string;
        role: FacultyRoleT;
      }> = [];
      const facultyMap = new Map(
        seededFaculty.map((f) => [f.facultyCode, f.id]),
      );

      // Assign dean role
      if (facultyMap.has('F001'))
        facultyRolesData.push({
          id: uuidv7(),
          facultyId: facultyMap.get('F001')!,
          role: FacultyRoleT.DEAN,
        });

      // Assign department head roles
      const departmentHeads = ['F002', 'F005', 'F007', 'F009', 'F016', 'F018'];
      departmentHeads.forEach((code) => {
        if (facultyMap.has(code))
          facultyRolesData.push({
            id: uuidv7(),
            facultyId: facultyMap.get(code)!,
            role: FacultyRoleT.DEPARTMENT_HEAD,
          });
      });

      // Assign advisor roles
      if (facultyMap.has('F003'))
        facultyRolesData.push({
          id: uuidv7(),
          facultyId: facultyMap.get('F003')!,
          role: FacultyRoleT.ADVISOR,
        });

      // Assign secretary role
      if (facultyMap.has('F004'))
        facultyRolesData.push({
          id: uuidv7(),
          facultyId: facultyMap.get('F004')!,
          role: FacultyRoleT.SECRETARY,
        });

      // Assign lecturer role to all faculty members
      seededFaculty.forEach((faculty) => {
        if (
          !facultyRolesData.some(
            (fr) =>
              fr.facultyId === faculty.id && fr.role === FacultyRoleT.LECTURER,
          )
        ) {
          facultyRolesData.push({
            id: uuidv7(),
            facultyId: faculty.id,
            role: FacultyRoleT.LECTURER,
          });
        }
      });

      // Assign reviewer roles
      const reviewerCodes = [
        'F006',
        'F008',
        'F010',
        'F012',
        'F014',
        'F017',
        'F019',
      ];
      reviewerCodes.forEach((code) => {
        if (
          facultyMap.has(code) &&
          !facultyRolesData.some(
            (fr) =>
              fr.facultyId === facultyMap.get(code) &&
              fr.role === FacultyRoleT.REVIEWER,
          )
        ) {
          facultyRolesData.push({
            id: uuidv7(),
            facultyId: facultyMap.get(code)!,
            role: FacultyRoleT.REVIEWER,
          });
        }
      });

      await tx.facultyRole.createMany({ data: facultyRolesData });
      console.log(`✅ Seeded ${facultyRolesData.length} faculty roles.`);

      console.log('Seeding Field Pool Domains...');
      const fieldPoolDomainsData: Array<{
        fieldPoolId: string;
        domainId: string;
      }> = [];

      // Map field pools to relevant domains
      const fieldPoolToDomainsMap = {
        'Artificial Intelligence (AI)': [
          'Machine Learning',
          'Deep Learning',
          'Computer Vision',
          'Natural Language Processing',
        ],
        'Software Engineering': [
          'Software Engineering',
          'Web Development',
          'Mobile Development',
          'Database Systems',
          'Cloud Computing',
        ],
        'Automotive Engineering': ['Engine Design', 'Control Systems'],
        Automation: ['Control Systems', 'Robotics', 'IoT'],
        'Structural Engineering': ['Structural Analysis', 'Material Testing'],
        'Data Science': ['Big Data', 'Machine Learning', 'Database Systems'],
        'Computer Networks': [
          'Network Security',
          'Cybersecurity',
          'Cloud Computing',
        ],
        'Embedded Systems': ['IoT', 'Control Systems'],
        'Transportation Planning': ['Logistics'],
        'Economics and Finance': ['Financial Analysis'],
        'Material Science': ['Material Testing'],
        'Renewable Energy': ['Solar Energy'],
      };

      // Create map for easy domain lookup by name
      const domainMap = new Map(
        seededDomains.map((domain) => [domain.name, domain.id]),
      );

      // Create map for easy field pool lookup by name
      const fieldPoolMap = new Map(
        seededFieldPools.map((pool) => [pool.name, pool.id]),
      );

      // Create field pool domain associations
      Object.entries(fieldPoolToDomainsMap).forEach(
        ([poolName, domainNames]) => {
          const poolId = fieldPoolMap.get(poolName);
          if (poolId) {
            domainNames.forEach((domainName) => {
              const domainId = domainMap.get(domainName);
              if (domainId) {
                fieldPoolDomainsData.push({
                  fieldPoolId: poolId,
                  domainId: domainId,
                });
              }
            });
          }
        },
      );

      if (fieldPoolDomainsData.length > 0) {
        await tx.fieldPoolDomain.createMany({ data: fieldPoolDomainsData });
        console.log(
          `✅ Seeded ${fieldPoolDomainsData.length} field pool domain links.`,
        );
      } else {
        console.log('⚠️ No field pool domain links to seed.');
      }

      console.log('Seeding Field Pool Departments...');
      const fieldPoolDepartmentsData: Array<{
        fieldPoolId: string;
        departmentId: string;
      }> = [];

      // Define which field pools belong to which departments
      const departmentFieldPools = {
        IT: [
          'Artificial Intelligence (AI)',
          'Software Engineering',
          'Data Science',
          'Computer Networks',
          'Embedded Systems',
        ],
        MECH: ['Automotive Engineering', 'Material Science'],
        EEE: ['Automation', 'Embedded Systems', 'Renewable Energy'],
        CIVIL: ['Structural Engineering', 'Material Science'],
        ECON: ['Economics and Finance'],
        TRANS: ['Transportation Planning', 'Logistics'],
      };

      // Create field pool department associations
      Object.entries(departmentFieldPools).forEach(([deptCode, poolNames]) => {
        const deptId = deptMap.get(deptCode);
        if (deptId) {
          poolNames.forEach((poolName) => {
            const poolId = fieldPoolMap.get(poolName);
            if (poolId) {
              fieldPoolDepartmentsData.push({
                fieldPoolId: poolId,
                departmentId: deptId,
              });
            }
          });
        }
      });

      if (fieldPoolDepartmentsData.length > 0) {
        await tx.fieldPoolDepartment.createMany({
          data: fieldPoolDepartmentsData,
        });
        console.log(
          `✅ Seeded ${fieldPoolDepartmentsData.length} field pool department links.`,
        );
      } else {
        console.log('⚠️ No field pool department links to seed.');
      }

      console.log('Seeding Lecturer Selections...');
      // Distribute lecturer selections among faculty members
      const lecturerSelectionsWithIds: Array<Prisma.LecturerSelectionUncheckedCreateInput> =
        [];
      const facultyCodes = Array.from(facultyMap.keys());

      for (let i = 0; i < lecturerSelections.length; i++) {
        const selection = lecturerSelections[i];
        const facultyCode = facultyCodes[i % facultyCodes.length];
        const lecturerId = facultyMap.get(facultyCode);

        // Find appropriate field pool for this lecturer (based on department)
        const faculty = seededFaculty.find((f) => f.id === lecturerId);
        const departmentCode = seededDepartments.find(
          (d) => d.id === faculty?.departmentId,
        )?.departmentCode;

        let fieldPoolId: string | undefined = undefined;
        if (departmentCode && departmentFieldPools[departmentCode]) {
          const possiblePools = departmentFieldPools[departmentCode];
          const poolName = possiblePools[i % possiblePools.length];
          fieldPoolId = fieldPoolMap.get(poolName);
        }

        if (lecturerId && fieldPoolId) {
          lecturerSelectionsWithIds.push({
            ...selection,
            lecturerId,
            fieldPoolId,
          });
        }
      }

      await tx.lecturerSelection.createMany({
        data: lecturerSelectionsWithIds,
      });
      const seededLecturerSelections = await tx.lecturerSelection.findMany();
      console.log(
        `✅ Seeded ${seededLecturerSelections.length} lecturer selections.`,
      );

      console.log('Seeding Student Selections...');
      const studentSelectionsData: Prisma.StudentSelectionUncheckedCreateInput[] =
        [];

      // Create a selection for each student from their department
      for (const student of seededStudents) {
        // Find the department of the student
        const departmentId = student.departmentId;
        if (!departmentId) continue;

        const departmentCode = seededDepartments.find(
          (d) => d.id === departmentId,
        )?.departmentCode;
        if (!departmentCode) continue;

        // Find field pools for this department
        const departmentPools = departmentFieldPools[departmentCode] || [];
        if (departmentPools.length === 0) continue;

        // Select a random field pool for this student
        const poolName =
          departmentPools[Math.floor(Math.random() * departmentPools.length)];
        const fieldPoolId = fieldPoolMap.get(poolName);
        if (!fieldPoolId) continue;

        // Find lecturers in this department who have selections for this field pool
        const availableLecturerSelections = seededLecturerSelections.filter(
          (ls) => ls.fieldPoolId === fieldPoolId,
        );

        if (availableLecturerSelections.length === 0) continue;

        // Select a random lecturer selection
        const lecturerSelection =
          availableLecturerSelections[
            Math.floor(Math.random() * availableLecturerSelections.length)
          ];

        // Determine if the selection should be approved (50% chance)
        const isApproved = Math.random() > 0.5;

        studentSelectionsData.push({
          id: uuidv7(),
          priority: 1,
          status: isApproved
            ? StudentSelectionStatusT.APPROVED
            : StudentSelectionStatusT.PENDING,
          studentId: student.id,
          lecturerId: lecturerSelection.lecturerId,
          fieldPoolId: fieldPoolId,
          preferredAt: new Date(),
          approvedByFacultyId: isApproved ? dean?.id : null,
          topicTitle: lecturerSelection.topicTitle,
          version: 1,
          description: `Student selection for ${poolName}`,
        });
      }

      if (studentSelectionsData.length > 0) {
        await tx.studentSelection.createMany({ data: studentSelectionsData });
        console.log(
          `✅ Seeded ${studentSelectionsData.length} student selections.`,
        );
      } else {
        console.log('⚠️ No student selections to seed.');
      }

      console.log('Seeding Project Allocations...');
      const projectAllocationsData: Prisma.ProjectAllocationUncheckedCreateInput[] =
        [];

      // Filter approved student selections
      const approvedSelections = studentSelectionsData.filter(
        (ss) => ss.status === StudentSelectionStatusT.APPROVED && ss.lecturerId,
      );

      // Create allocations for approved selections
      approvedSelections.forEach((sel) => {
        if (dean && sel.studentId && sel.lecturerId && sel.topicTitle) {
          const allocationData: Prisma.ProjectAllocationUncheckedCreateInput = {
            id: uuidv7(),
            topicTitle: sel.topicTitle,
            allocatedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            studentId: sel.studentId,
            createdById: dean.id,
            lecturerId: sel.lecturerId,
            version: 1,
          };
          projectAllocationsData.push(allocationData);
        }
      });

      if (projectAllocationsData.length > 0) {
        await tx.projectAllocation.createMany({ data: projectAllocationsData });
        console.log(
          `✅ Seeded ${projectAllocationsData.length} project allocations.`,
        );
      } else {
        console.log('⚠️ No project allocations to seed.');
      }

      // Get the created allocations
      const seededAllocations = await tx.projectAllocation.findMany({
        include: {
          Student: { select: { id: true, departmentId: true } },
          Lecturer: { select: { id: true } },
        },
      });

      console.log('Seeding Proposed Projects...');
      const proposedProjectsData: Prisma.ProposedProjectUncheckedCreateInput[] =
        [];

      // Create proposed projects for each allocation
      seededAllocations.forEach((allocation) => {
        // Find an appropriate field pool for this allocation's department
        const departmentId = allocation.Student?.departmentId;
        const department = seededDepartments.find((d) => d.id === departmentId);
        const departmentCode = department?.departmentCode;

        let fieldPoolId: string | undefined = undefined;
        if (departmentCode && departmentFieldPools[departmentCode]) {
          const possiblePools = departmentFieldPools[departmentCode];
          const poolName = possiblePools[0]; // Just take the first pool for simplicity
          fieldPoolId = fieldPoolMap.get(poolName);
        }

        proposedProjectsData.push({
          id: uuidv7(),
          projectAllocationId: allocation.id,
          title: `Đề xuất: ${allocation.topicTitle}`,
          description: `Mô tả chi tiết về đề tài: ${allocation.topicTitle}`,
          status: ProposedProjectStatusT.TOPIC_SUBMISSION_PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
          proposalDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          createdByFacultyId: dean?.id || null,
          fieldPoolId,
          version: 1,
          approvedById: null,
          approvedAt: null,
        });
      });

      if (proposedProjectsData.length > 0) {
        await tx.proposedProject.createMany({ data: proposedProjectsData });
        console.log(
          `✅ Seeded ${proposedProjectsData.length} proposed projects.`,
        );

        // Get the created proposed projects
        const seededProposedProjects = await tx.proposedProject.findMany({
          include: {
            ProjectAllocation: {
              include: {
                Student: true,
                Lecturer: true,
              },
            },
          },
        });

        console.log('Seeding Proposed Project Members...');
        const proposedProjectMembersData: Prisma.ProposedProjectMemberUncheckedCreateInput[] =
          [];

        // Create members for each proposed project
        for (const project of seededProposedProjects) {
          if (project.ProjectAllocation) {
            // Add student member
            proposedProjectMembersData.push({
              id: uuidv7(),
              proposedProjectId: project.id,
              studentId: project.ProjectAllocation.studentId,
              role: 'STUDENT',
              status: 'ACTIVE',
              assignedAt: new Date(),
            });

            // Add faculty member (advisor)
            proposedProjectMembersData.push({
              id: uuidv7(),
              proposedProjectId: project.id,
              facultyId: project.ProjectAllocation.lecturerId,
              role: 'ADVISOR',
              status: 'ACTIVE',
              assignedAt: new Date(),
            });
          }
        }

        if (proposedProjectMembersData.length > 0) {
          await tx.proposedProjectMember.createMany({
            data: proposedProjectMembersData,
          });
          console.log(
            `✅ Seeded ${proposedProjectMembersData.length} proposed project members.`,
          );
        } else {
          console.log('⚠️ No proposed project members to seed.');
        }

        // Don't create projects since none are approved (all are TOPIC_SUBMISSION_PENDING)
        console.log(
          '⚠️ No approved proposals to create projects from - all are in TOPIC_SUBMISSION_PENDING state.',
        );
      } else {
        console.log('⚠️ No proposed projects to seed.');
      }

      console.log('Seeding Evaluation Criteria...');
      const evaluationCriteriaData: Prisma.EvaluationCriteriaUncheckedCreateInput[] =
        [];

      if (criteriaCreator) {
        evaluationCriteria.forEach((criteria) => {
          const criteriaData: Prisma.EvaluationCriteriaUncheckedCreateInput = {
            id: criteria.id,
            name: criteria.name,
            description: criteria.description,
            weight: criteria.weight,
            isDefault: criteria.isDefault,
            version: criteria.version,
            createdById: criteriaCreator.id,
          };
          evaluationCriteriaData.push(criteriaData);
        });
        await tx.evaluationCriteria.createMany({
          data: evaluationCriteriaData,
        });
        const seededCriteria = await tx.evaluationCriteria.findMany();
        console.log(`✅ Seeded ${seededCriteria.length} evaluation criteria.`);
      } else {
        console.log(
          '⚠️ Cannot find creator (Faculty) for evaluation criteria, skipping.',
        );
      }

      console.log('✅ Seeding transaction completed successfully.');
    });
  } catch (error) {
    console.error('🔴 Seeding transaction failed:', error);
    throw error;
  }

  console.log('✅ Database seeding process completed!');
}

main()
  .catch((e) => {
    console.error('🔴 Seeding process failed overall:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
