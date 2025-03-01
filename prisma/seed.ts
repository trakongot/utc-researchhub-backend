// import prisma from 'src/components/prisma';

// async function main() {
//   // Xóa dữ liệu cũ trong tất cả các bảng
//   await prisma.graduationProjectAllocations.deleteMany({});
//   await prisma.studentAdvisingPreferences.deleteMany({});
//   await prisma.lecturerPreferences.deleteMany({});
//   await prisma.students.deleteMany({});
//   await prisma.facultyMembers.deleteMany({});
//   await prisma.field.deleteMany({});

//   // Fields data with id
//   const fieldsData = [
//     { id: 'F1', name: 'Artificial Intelligence' },
//     { id: 'F2', name: 'Computer Science' },
//     { id: 'F3', name: 'Data Science' },
//     { id: 'F4', name: 'Software Engineering' },
//     { id: 'F5', name: 'Networking' },
//     { id: 'F6', name: 'Cybersecurity' },
//     { id: 'F7', name: 'Database Systems' },
//     { id: 'F8', name: 'Computer Graphics' },
//     { id: 'F9', name: 'Operating Systems' },
//     { id: 'F10', name: 'Human-Computer Interaction' },
//   ];

//   // Insert fields and store results
//   const fields = await Promise.all(
//     fieldsData.map((data) => prisma.field.create({ data })),
//   );

//   // SubFields data with id
//   const subFieldsData = [
//     { id: 'SF1', name: 'Machine Learning', parentId: fields[0].id },
//     { id: 'SF2', name: 'Natural Language Processing', parentId: fields[0].id },
//     { id: 'SF3', name: 'Algorithms', parentId: fields[1].id },
//     { id: 'SF4', name: 'Statistics', parentId: fields[2].id },
//     { id: 'SF5', name: 'Development', parentId: fields[3].id },
//     { id: 'SF6', name: 'Protocols', parentId: fields[4].id },
//     { id: 'SF7', name: 'Encryption', parentId: fields[5].id },
//     { id: 'SF8', name: 'Query Optimization', parentId: fields[6].id },
//     { id: 'SF9', name: 'Rendering', parentId: fields[7].id },
//     { id: 'SF10', name: 'UI Design', parentId: fields[9].id },
//   ];

//   // Insert subfields and store results
//   const subFields = await Promise.all(
//     subFieldsData.map((data) => prisma.field.create({ data })),
//   );

//   // Lecturers data with id
//   const lecturersData = [
//     {
//       id: 'L1',
//       fullName: 'Dr. John Doe',
//       email: 'john.doe@example.com',
//       password: 'pass123',
//       facultyCode: 'F001',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'L2',
//       fullName: 'Prof. Mary Smith',
//       email: 'mary.smith@example.com',
//       password: 'pass456',
//       facultyCode: 'F002',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'L3',
//       fullName: 'Dr. Peter Brown',
//       email: 'peter.b@example.com',
//       password: 'pass789',
//       facultyCode: 'F003',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'L4',
//       fullName: 'Prof. Alice Chen',
//       email: 'alice.c@example.com',
//       password: 'pass101',
//       facultyCode: 'F004',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'L5',
//       fullName: 'Dr. Robert Wilson',
//       email: 'robert.w@example.com',
//       password: 'pass112',
//       facultyCode: 'F005',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'L6',
//       fullName: 'Prof. Linda Davis',
//       email: 'linda.d@example.com',
//       password: 'pass131',
//       facultyCode: 'F006',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'L7',
//       fullName: 'Dr. James Taylor',
//       email: 'james.t@example.com',
//       password: 'pass415',
//       facultyCode: 'F007',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'L8',
//       fullName: 'Prof. Sarah Lee',
//       email: 'sarah.l@example.com',
//       password: 'pass161',
//       facultyCode: 'F008',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'L9',
//       fullName: 'Dr. Michael Kim',
//       email: 'michael.k@example.com',
//       password: 'pass718',
//       facultyCode: 'F009',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'L10',
//       fullName: 'Prof. Emma White',
//       email: 'emma.w@example.com',
//       password: 'pass192',
//       facultyCode: 'F010',
//       status: 'ACTIVE',
//     },
//   ];

//   // Insert lecturers and store results
//   const lecturers = await Promise.all(
//     lecturersData.map((data) => prisma.facultyMembers.create({ data })),
//   );

//   // Students data with id
//   const studentsData = [
//     {
//       id: 'S1',
//       studentCode: 'S001',
//       fullName: 'Jane Smith',
//       email: 'jane.smith@example.com',
//       password: 'stu123',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'S2',
//       studentCode: 'S002',
//       fullName: 'Tom Wilson',
//       email: 'tom.w@example.com',
//       password: 'stu456',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'S3',
//       studentCode: 'S003',
//       fullName: 'Lisa Chen',
//       email: 'lisa.c@example.com',
//       password: 'stu789',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'S4',
//       studentCode: 'S004',
//       fullName: 'Mark Taylor',
//       email: 'mark.t@example.com',
//       password: 'stu101',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'S5',
//       studentCode: 'S005',
//       fullName: 'Sophie Brown',
//       email: 'sophie.b@example.com',
//       password: 'stu112',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'S6',
//       studentCode: 'S006',
//       fullName: 'David Lee',
//       email: 'david.l@example.com',
//       password: 'stu131',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'S7',
//       studentCode: 'S007',
//       fullName: 'Emily Davis',
//       email: 'emily.d@example.com',
//       password: 'stu415',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'S8',
//       studentCode: 'S008',
//       fullName: 'Chris Kim',
//       email: 'chris.k@example.com',
//       password: 'stu161',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'S9',
//       studentCode: 'S009',
//       fullName: 'Anna White',
//       email: 'anna.w@example.com',
//       password: 'stu718',
//       status: 'ACTIVE',
//     },
//     {
//       id: 'S10',
//       studentCode: 'S010',
//       fullName: 'Brian Green',
//       email: 'brian.g@example.com',
//       password: 'stu192',
//       status: 'ACTIVE',
//     },
//   ];

//   // Insert students and store results
//   const students = await Promise.all(
//     studentsData.map((data) => prisma.students.create({ data })),
//   );

//   // Lecturer Preferences data with id
//   const lecturerPreferencesData = [
//     {
//       id: 'LP1',
//       position: 1,
//       topicTitle: 'AI in Healthcare',
//       description: 'AI applications in medical diagnosis',
//       lecturerId: lecturers[0].id,
//       fieldId: subFields[0].id,
//     },
//     {
//       id: 'LP2',
//       position: 2,
//       topicTitle: 'NLP Applications',
//       description: 'Text processing techniques',
//       lecturerId: lecturers[1].id,
//       fieldId: subFields[1].id,
//     },
//     {
//       id: 'LP3',
//       position: 1,
//       topicTitle: 'Algorithm Design',
//       description: 'Efficient algorithm solutions',
//       lecturerId: lecturers[2].id,
//       fieldId: subFields[2].id,
//     },
//     {
//       id: 'LP4',
//       position: 3,
//       topicTitle: 'Statistical Modeling',
//       description: 'Data analysis methods',
//       lecturerId: lecturers[3].id,
//       fieldId: subFields[3].id,
//     },
//     {
//       id: 'LP5',
//       position: 2,
//       topicTitle: 'Software Design',
//       description: 'Design patterns',
//       lecturerId: lecturers[4].id,
//       fieldId: subFields[4].id,
//     },
//     {
//       id: 'LP6',
//       position: 1,
//       topicTitle: 'Network Protocols',
//       description: 'Network communication',
//       lecturerId: lecturers[5].id,
//       fieldId: subFields[5].id,
//     },
//     {
//       id: 'LP7',
//       position: 2,
//       topicTitle: 'Cybersecurity Basics',
//       description: 'Encryption techniques',
//       lecturerId: lecturers[6].id,
//       fieldId: subFields[6].id,
//     },
//     {
//       id: 'LP8',
//       position: 1,
//       topicTitle: 'Database Optimization',
//       description: 'Query performance',
//       lecturerId: lecturers[7].id,
//       fieldId: subFields[7].id,
//     },
//     {
//       id: 'LP9',
//       position: 3,
//       topicTitle: '3D Rendering',
//       description: 'Graphics rendering',
//       lecturerId: lecturers[8].id,
//       fieldId: subFields[8].id,
//     },
//     {
//       id: 'LP10',
//       position: 2,
//       topicTitle: 'UI/UX Design',
//       description: 'User interface design',
//       lecturerId: lecturers[9].id,
//       fieldId: subFields[9].id,
//     },
//   ];

//   // Insert lecturer preferences
//   await Promise.all(
//     lecturerPreferencesData.map((data) =>
//       prisma.lecturerPreferences.create({ data }),
//     ),
//   );

//   // Student Advising Preferences data with id
//   const studentAdvisingPreferencesData = [
//     {
//       id: 'SAP1',
//       studentId: students[0].id,
//       facultyMemberId: lecturers[0].id,
//       fieldId: fields[0].id,
//     },
//     {
//       id: 'SAP2',
//       studentId: students[1].id,
//       facultyMemberId: lecturers[1].id,
//       fieldId: fields[0].id,
//     },
//     {
//       id: 'SAP3',
//       studentId: students[2].id,
//       facultyMemberId: lecturers[2].id,
//       fieldId: fields[1].id,
//     },
//     {
//       id: 'SAP4',
//       studentId: students[3].id,
//       facultyMemberId: lecturers[3].id,
//       fieldId: fields[2].id,
//     },
//     {
//       id: 'SAP5',
//       studentId: students[4].id,
//       facultyMemberId: lecturers[4].id,
//       fieldId: fields[3].id,
//     },
//     {
//       id: 'SAP6',
//       studentId: students[5].id,
//       facultyMemberId: lecturers[5].id,
//       fieldId: fields[4].id,
//     },
//     {
//       id: 'SAP7',
//       studentId: students[6].id,
//       facultyMemberId: lecturers[6].id,
//       fieldId: fields[5].id,
//     },
//     {
//       id: 'SAP8',
//       studentId: students[7].id,
//       facultyMemberId: lecturers[7].id,
//       fieldId: fields[6].id,
//     },
//     {
//       id: 'SAP9',
//       studentId: students[8].id,
//       facultyMemberId: lecturers[8].id,
//       fieldId: fields[7].id,
//     },
//     {
//       id: 'SAP10',
//       studentId: students[9].id,
//       facultyMemberId: lecturers[9].id,
//       fieldId: fields[9].id,
//     },
//   ];

//   // Insert student advising preferences
//   await Promise.all(
//     studentAdvisingPreferencesData.map((data) =>
//       prisma.studentAdvisingPreferences.create({ data }),
//     ),
//   );

//   // Graduation Project Allocations data with id
//   const graduationProjectAllocationsData = [
//     {
//       id: 'GPA1',
//       topicTitle: 'AI-Powered Diagnosis System',
//       studentId: students[0].id,
//       lecturerId: lecturers[0].id,
//     },
//     {
//       id: 'GPA2',
//       topicTitle: 'Sentiment Analysis Tool',
//       studentId: students[1].id,
//       lecturerId: lecturers[1].id,
//     },
//     {
//       id: 'GPA3',
//       topicTitle: 'Sorting Algorithm Visualizer',
//       studentId: students[2].id,
//       lecturerId: lecturers[2].id,
//     },
//     {
//       id: 'GPA4',
//       topicTitle: 'Predictive Analytics Dashboard',
//       studentId: students[3].id,
//       lecturerId: lecturers[3].id,
//     },
//     {
//       id: 'GPA5',
//       topicTitle: 'Task Management App',
//       studentId: students[4].id,
//       lecturerId: lecturers[4].id,
//     },
//     {
//       id: 'GPA6',
//       topicTitle: 'Network Monitoring System',
//       studentId: students[5].id,
//       lecturerId: lecturers[5].id,
//     },
//     {
//       id: 'GPA7',
//       topicTitle: 'Secure File Storage',
//       studentId: students[6].id,
//       lecturerId: lecturers[6].id,
//     },
//     {
//       id: 'GPA8',
//       topicTitle: 'Database Management Tool',
//       studentId: students[7].id,
//       lecturerId: lecturers[7].id,
//     },
//     {
//       id: 'GPA9',
//       topicTitle: '3D Game Engine',
//       studentId: students[8].id,
//       lecturerId: lecturers[8].id,
//     },
//     {
//       id: 'GPA10',
//       topicTitle: 'Interactive UI Prototype',
//       studentId: students[9].id,
//       lecturerId: lecturers[9].id,
//     },
//   ];

//   // Insert graduation project allocations
//   await Promise.all(
//     graduationProjectAllocationsData.map((data) =>
//       prisma.graduationProjectAllocations.create({ data }),
//     ),
//   );
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
